from rest_framework import status, views, permissions
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from .serializers import LoginSerializer, RegisterSerializer, UserSerializer, TenantSummarySerializer, UserProfileSerializer
from tenant.models import Tenant
from .models import UserProfile

class ProfileView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response(serializer.data)

    def patch(self, request):
        user = request.user
        profile, _ = UserProfile.objects.get_or_create(user=user)
        
        user_serializer = UserSerializer(user, data=request.data, partial=True)
        profile_serializer = UserProfileSerializer(profile, data=request.data.get('profile', {}), partial=True)
        
        if user_serializer.is_valid() and profile_serializer.is_valid():
            user_serializer.save()
            profile_serializer.save()
            return Response(UserSerializer(user).data)
        
        errors = {}
        errors.update(user_serializer.errors)
        errors.update(profile_serializer.errors)
        return Response(errors, status=status.HTTP_400_BAD_REQUEST)

class ChangePasswordView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user = request.user
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')
        
        if not user.check_password(old_password):
            return Response({'error': 'Incorrect current password'}, status=status.HTTP_400_BAD_REQUEST)
        
        user.set_password(new_password)
        user.save()
        return Response({'message': 'Password updated successfully'})

class LoginView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            user = authenticate(
                username=serializer.validated_data['username'],
                password=serializer.validated_data['password']
            )
            if user:
                token, _ = Token.objects.get_or_create(user=user)
                # Find the tenant(s) the user belongs to
                tenant = user.owned_tenants.first() or user.tenants.first()
                tenant_data = TenantSummarySerializer(tenant).data if tenant else None
                
                return Response({
                    'token': token.key,
                    'user': UserSerializer(user).data,
                    'tenant': tenant_data
                })
            return Response({'error': 'Invalid Credentials'}, status=status.HTTP_401_UNAUTHORIZED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class RegisterView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            user, tenant = serializer.create(serializer.validated_data)
            
            # Optionally handle uploaded files
            if 'gstFile' in request.FILES:
                tenant.gst_file = request.FILES['gstFile']
            if 'panFile' in request.FILES:
                tenant.pan_file = request.FILES['panFile']
            if 'businessProof' in request.FILES:
                tenant.business_proof = request.FILES['businessProof']
            tenant.save()
            
            token, _ = Token.objects.get_or_create(user=user)
            return Response({
                'token': token.key,
                'user': UserSerializer(user).data,
                'tenant': TenantSummarySerializer(tenant).data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
