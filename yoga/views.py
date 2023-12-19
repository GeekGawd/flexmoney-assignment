from rest_framework.response import Response
from rest_framework.generics import GenericAPIView
from rest_framework import mixins, status
from .models import YogaBatch, YogaBooking, YogaTimings, Offer, Order
import datetime
from .serializers import YogaBookingSerializer, YogaBatchSerializer
from django.db.models import F


class HelloWorld(GenericAPIView):
    def get(self, request):
        return Response({"message": "Hello, world!"})

class YogaBatchView(GenericAPIView):
    serializer_class = YogaBatchSerializer
    def post(self, request, *args, **kwargs):
        year = request.data.get("year")
        month = request.data.get("month")
        try:
            yoga_batch = YogaBatch.objects.get(year=year, month=month)
        except YogaBatch.DoesNotExist:
            return Response({"message": "No Slot Available"})
        data = self.serializer_class(yoga_batch).data
        return Response(data)

class YogaBookingView(GenericAPIView, mixins.CreateModelMixin):
    serializer_class = YogaBookingSerializer

    def post(self, request, *args, **kwargs):
        date_of_birth = request.data.get("date_of_birth")
        email = request.data.get("email")
        yoga_timing = request.data.get("yoga_timing")
        offer = request.data.get("coupon_code", None)

        if offer:
            try:
                offer = Offer.objects.get(code=offer)
            except Offer.DoesNotExist:
                return Response({"message": "Invalid Coupon Code"}, status=status.HTTP_404_NOT_FOUND)
            if offer.validity_count == 0:
                return Response({"message": "Coupon Code Expired"}, status=status.HTTP_400_BAD_REQUEST)
        
        if date_of_birth:
            date_of_birth = datetime.datetime.strptime(date_of_birth, "%d-%m-%Y").date()
            formatted_date = date_of_birth.strftime("%Y-%m-%d")
        request.data["date_of_birth"] = formatted_date

        try:
            yoga_timing = YogaTimings.objects.get(external_id=yoga_timing)
            request.data["yoga_batch"] = yoga_timing.batch.id
            yoga_batch = yoga_timing.batch
        except YogaTimings.DoesNotExist:
            return Response({"message": "Invalid Yoga Timing"}, status=status.HTTP_404_NOT_FOUND)
        try: 
            yoga_booking_paid = YogaBooking.objects.get(email=email, yoga_batch=yoga_batch).is_paid
            if yoga_booking_paid:
                return Response({"message": "Already Booked"}, status=status.HTTP_400_BAD_REQUEST)
        except YogaBooking.DoesNotExist:
            pass
        return super().create(request, *args, **kwargs)
    
class PaymentView(GenericAPIView):
    def post(self, request, *args, **kwargs):
        order_id = request.data.get("order_id")

        try:
            order = Order.objects.get(external_id=order_id)
            if order.status == "paid":
                return Response({"message": "Already Paid"}, status=status.HTTP_400_BAD_REQUEST)
            order.status = "paid"
            order.save(update_fields=["status"])
            offer = order.offer
            if offer:
                offer.validity_count = F("validity_count") - 1
                offer.save(update_fields=["validity_count"])
        except Order.DoesNotExist:
            return Response({"message": "Invalid Order ID"}, status=status.HTTP_404_NOT_FOUND)
        return Response({"message": "Payment Successful"})