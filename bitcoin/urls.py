from django.urls import path 
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('bitcoin/', views.bitcoin, name='bitcoin'),
    path("wallet/", views.wallet_view, name="wallet"),
    # path('index_bitcoin/', views.index_bitcoin, name='index_bitcoin'),
]