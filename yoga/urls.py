from django.urls import path
from . import views

urlpatterns = [
    path('', views.HelloWorld.as_view(), name='home'),
    path('get-slots/', views.YogaBatchView.as_view(), name='get_slots'),
    path('yoga-booking/', views.YogaBookingView.as_view(), name='yoga_booking'),
    path('payment/', views.PaymentView.as_view(), name="payment")
]