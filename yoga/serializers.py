from rest_framework import serializers
from .models import YogaBatch, YogaBooking, YogaTimings, Order, Offer
import datetime


class YogaBookingSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = YogaBooking
        exclude = ("id", "created_at")
        read_only_fields = ("external_id", "created_at",)
    
    def validate_date_of_birth(self, value):
        today = datetime.date.today()
        if (today.year - value.year) < 18:
            raise serializers.ValidationError("You must be 18 years or older to book a yoga class")
        if (today.year - value.year) > 65:
            raise serializers.ValidationError("You must be 65 years or younger to book a yoga class")
        return value
    
    def create(self, validated_data):
        offer = self.initial_data.get("coupon_code", None)
        yoga_timing = self.initial_data.get("yoga_timing")
        yoga_booking, _ = YogaBooking.objects.get_or_create(**validated_data)
        amount = 500
        offer_instance = None
        if offer:
            offer_instance = Offer.objects.get(code=offer)
            amount -= offer_instance.discount
        currency = "INR"
        status = "created"
        yoga_timing = YogaTimings.objects.get(external_id=yoga_timing)
        if offer_instance:
            Order.objects.create(amount=amount, currency=currency, status=status, yoga_booking=yoga_booking, yoga_batch=yoga_timing.batch, yoga_timing=yoga_timing, offer=offer_instance)
        else:
            Order.objects.create(amount=amount, currency=currency, status=status, yoga_booking=yoga_booking, yoga_batch=yoga_timing.batch, yoga_timing=yoga_timing)
        return yoga_booking
    
    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["order"] = instance.order.last().external_id
        data["proceed_to_pay"] = instance.order.last().amount
        data.pop("yoga_batch")
        return data
    
class NestedYogaBatchTimingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = YogaTimings
        exclude = ("id", "timespan", "batch")
        read_only_fields = ("external_id", "created_at",)

class YogaBatchSerializer(serializers.ModelSerializer):
    timings = NestedYogaBatchTimingsSerializer(many=True)
    class Meta:
        model = YogaBatch
        exclude = ("id", "created_at")
        read_only_fields = ("external_id", "created_at",)