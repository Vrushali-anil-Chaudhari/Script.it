from .serializers import MyTokenObtainPairSerializer
from rest_framework.permissions import AllowAny,IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.models import User
from .serializers import RegisterSerializer
from rest_framework import generics, status
from .models import CustomUser
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken


class MyObtainTokenPairView(TokenObtainPairView):
    permission_classes = (AllowAny,)
    serializer_class = MyTokenObtainPairSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
        except Exception as e:
            return Response({"error": str(e)}, status=400)
        
        token_data = serializer.validated_data

        # Structure the response
        response_data = {
            'data': {
                'access_token': token_data['access'],
                'refresh_token': token_data['refresh'],
                'user': {
                    'username': token_data['user']['username'],
                    'email': token_data['user']['email']
                    
                },
                "message": "Login Successfull"

            }
        }
        
        return Response(response_data, status=200)


class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=False)  
        if not serializer.is_valid():
            return Response(
                {"error": serializer.errors, "message": "Registration not successful"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            {"data": serializer.data, "message": "Registration successful"},
            status=status.HTTP_201_CREATED,
            headers=headers,
        )

class LogoutView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request):
        try:
            # auth_header = request.headers.get("Authorization")
            # if not auth_header or not auth_header.startswith("Bearer "):
            #     return Response({"error": "Invalid token header"}, status=status.HTTP_400_BAD_REQUEST)
            
            refresh_token = request.data.get('refresh_token')
            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response({"message": "Successfully logged out."}, status=status.HTTP_200_OK)
        except (TokenError, InvalidToken) as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": "An error occurred during logout."}, status=status.HTTP_400_BAD_REQUEST)
        


        