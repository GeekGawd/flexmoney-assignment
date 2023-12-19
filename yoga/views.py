from rest_framework.response import Response
from rest_framework.generics import GenericAPIView
from .models import YogaBatch, YogaBooking

class HelloWorld(GenericAPIView):
    def get(self, request):
        return Response({"message": "Hello, world!"})
    
class YogaBookingView(GenericAPIView):
    def post(self, request):
        name = request.data.get("name")
        email = request.data.get("email")
        date_of_birth = request.data.get("date_of_birth")

        batch_id = request.data.get("batch_id")