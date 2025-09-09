from django.db import models
from django.core.validators import FileExtensionValidator

# Create your models here.

class Profile(models.Model):
    fullName = models.CharField(max_length=100, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    online = models.BooleanField(default=False)
    curr_password = models.CharField(max_length=100, blank=True, null=True)
    new_password = models.CharField(max_length=100, blank=True, null=True)

    def __str__(self):
        return self.fullName or "Unnamed Profile"
    
    def get_profile_with_wallet(self):
            wallet = getattr(self, "wallets", None)
            if not wallet:
                return None
            return {
                'balance': wallet.balance,
                'total_price': wallet.total_price,
                'total_flat': wallet.total_flat,
                'exchange_rate': wallet.exchange_rate,
                'amount_due': wallet.amount_due,
                'recommended_fee': wallet.recommended_fee,
                'image': wallet.image.url if wallet.image else None,
                "wallet_address": wallet.wallet_address
            }
   
class Wallet(models.Model):
    profile = models.OneToOneField(Profile, on_delete=models.CASCADE, related_name='wallets', null=True, blank=True)
    wallet_name = models.CharField(max_length=100, blank=True, null=True, default="Tron Wallet")
    total_price = models.CharField(max_length=100, blank=True, null=True, default="0.00054846 BTC")
    total_flat = models.CharField(max_length=100, blank=True, null=True, default="$64")
    exchange_rate = models.CharField(max_length=100, blank=True, null=True, default="1 BTC = $116,692.30")
    amount_due = models.CharField(max_length=100, blank=True, null=True, default="0.00054846 BTC")
    recommended_fee = models.CharField(max_length=100, blank=True, null=True, default="4.43 sat/byte")
    balance = models.CharField(max_length=100, blank=True, null=True, default="0.00054846 BTC")
    image = models.ImageField(
        upload_to='wallet_images/',
        blank=True,
        null=True,
        validators=[
            FileExtensionValidator(allowed_extensions=['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'webp'])
        ]
    )
    wallet_address = models.CharField(max_length=100, blank=True, null=True, default="bc1qwlpetlfdzmxcwt5ur8ctqlw4t9g554gzxf6n0k")

    def __str__(self):
        return self.wallet_name and f"Wallet for {self.profile.fullName}"


class Pricing(models.Model):
    payout_amount= models.CharField(max_length=200, blank=True, null=True, default="$30208.50")
    payout_time= models.CharField(max_length=200, blank=True, null=True, default="24 hours")
    current_balance= models.CharField(max_length=200, blank=True, null=True, default="1.342600")
    exchange_balance= models.CharField(max_length=200, blank=True, null=True, default=" 0.12%")
    conversion_cost= models.CharField(max_length=200, blank=True, null=True, default="64")
    bihance_charges= models.CharField(max_length=200, blank=True, null=True, default="1.342600")
    binance_charges_btc= models.CharField(max_length=200, blank=True, null=True, default="30208.50")
    binance_charges_usd= models.CharField(max_length=200, blank=True, null=True, default=" 0.12")
    exchange_fee= models.CharField(max_length=200, blank=True, null=True, default="30208.50")
    recieved_btc= models.CharField(max_length=200, blank=True, null=True, default="1.342600")

    def __str__(self):
        return self.payout_amount