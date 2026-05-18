from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework import status, permissions
from rest_framework.generics import GenericAPIView,  RetrieveAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from .serializers import *
from .models import *
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from typing import Any
from django.http import FileResponse, Http404, HttpResponse
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.serializers import TokenRefreshSerializer


class VerifyCertificateView(APIView):
    permission_classes = (permissions.AllowAny,)
    def get(self, request, code):
        lesson = get_object_or_404(LessonPlan, verification_code = code)
        print(lesson.status)
        if lesson.status != "Approved":
            return HttpResponse({"invalid":"This Certificate is no longer valid"}, status=status.HTTP_400_BAD_REQUEST)
        
        file_path = lesson.certificate.path
        print(file_path)
        try:
            return FileResponse(
                open(lesson.certificate.path, "rb"),
                as_attachment=False,
                filename=f"{lesson.teacher.last_name,}_{lesson.plan_id}.pdf"
            )
        except FileNotFoundError:
            return Http404("Certificate file not found")


class CreateTokenAPIView(TokenObtainPairView):

    def post(self, request, *args, **kwargs):
        # Let SimpleJWT generate tokens first
        response = super().post(request, *args, **kwargs)

        access = response.data.get("access")
        refresh = response.data.get("refresh")

        # Create new clean response
        new_response = Response({"Success":"User Logged In"}, status=status.HTTP_200_OK)

        new_response.set_cookie(
            key="access",
            value=access,
            httponly=True,
            secure=True,  # True in production
            samesite="none",
        )

        new_response.set_cookie(
            key="refresh",
            value=refresh,
            httponly=True,
            secure=True, # True in production
            samesite="none",
        )

        return new_response
    
class CreateAccessTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        refresh = request.COOKIES.get("refresh")

        if not refresh:
            return Response({"error": "Refresh Token is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        request.data["refresh"] = refresh 

        response = super().post(request, *args, **kwargs)

        access = response.data.get("access")
        refresh = response.data.get("refresh")

        new_response = Response ({"Success": "Refreshed Access Token"}, status=status.HTTP_200_OK)

        new_response.set_cookie(
            key="access",
            value=access,
            httponly=True,
            secure=True,
            samesite="none"
        )

        if refresh:
            new_response.set_cookie(
                key="refresh",
                value=refresh,
                httponly=True,
                secure=True,
                samesite="none"
            )

        return new_response
    
class UserLogoutAPIView(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    def post(self, request, *args, **kwargs):
        try:
            refresh_token = request.COOKIES.get("refresh")

            if refresh_token:

                token = RefreshToken(refresh_token)
                token.blacklist()
            
            response = Response({"Success":"User Logged Out"},status=status.HTTP_205_RESET_CONTENT)

            response.delete_cookie("access")
            response.delete_cookie("refresh")

            return response
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)

class CountView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request):
        role = request.user.role
        
        if role == "Principal" or role == "PRINCIPAL":
            active_plans = LessonPlan.objects.filter(quarter__school_year__is_active=True)
            #add a is_active for teacher
            teacher_query = get_user_model().objects.filter(role = "Teacher").count()
            total_lesson_plan = active_plans.count()
            pending = active_plans.filter(status__iexact="Pending").count()
            approved = active_plans.filter(status__iexact="Approved").count()

            data = {
                "teacher_count":teacher_query, 
                "lesson_plan_count":total_lesson_plan, 
                "pending_lesson_plan":pending, 
                "approved_lesson_plan":approved 
                }

            
            
            return Response(data, status=status.HTTP_200_OK)
        else:
            return Response({"error":"Unauthorized"}, status=status.HTTP_401_UNAUTHORIZED)


class SchoolYearView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        data = request.data
        role = request.user.role

        if role == "Principal" or role == "PRINCIPAL":
            serializer = CreateSchoolYearSerializer(data=data)

            if serializer.is_valid():

                serializer.save()
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"error":"Only a Principal can create a school year"}, status=status.HTTP_403_FORBIDDEN)
        
    def get(self, request):
        role = request.user.role

        try:
            school_year_list = SchoolYear.objects.get(is_active=True)
            serializer = SchoolYearSerializer(school_year_list)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({"error":"Internal Server Error"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    def patch(self, request, year_id):
        role = request.user.role
        
        if not year_id:
            return Response({'error':'Year ID is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        
        if role == "Principal" or role == "PRINCIPAL":
            instance = SchoolYear.objects.get(year_id = year_id)
            serializer = UpdateSchoolYearSerializer(instance, request.data, partial=True)

            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
        
        else:
            return Response({"Unauthorized":"Only the Principal is allowed to update this"}, status=status.HTTP_401_UNAUTHORIZED)

#Quarter Views
class QuarterView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def get(self,request, year_id):
        role = request.user.role

        try:
            if not year_id:
                return Response({'error':'Year ID is required'}, status=status.HTTP_400_BAD_REQUEST)
            
            year = get_object_or_404(SchoolYear, year_id=year_id)
            quarters = Quarter.objects.filter(school_year = year)
            serializer = QuarterSerializer(quarters, many=True)

            return Response(serializer.data, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({'error': e},status=status.HTTP_500_INTERNAL_SERVER_ERROR)


    def patch(self, request):
        data = request.data
        role = request.user.role
        updated_quarters = []

        for item in data:
            quarter_id = item.get("quarter_id")
            deadline = item.get("deadline")
            try:
                quarter = Quarter.objects.get(
                    quarter_id=quarter_id
                )
                quarter.deadline = deadline
                quarter.save()
                updated_quarters.append(quarter)
            except Quarter.DoesNotExist:
                continue

        if role == "Principal" or role == "PRINCIPAL":
            serializer = UpdateQuarterSerializer(data = data, many=True)
            if serializer.is_valid():
                
                return Response(UpdateQuarterSerializer(updated_quarters, many=True).data, status=status.HTTP_200_OK)
            else:
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({"Unauthorized":"Principal is the only one that can access this!"}, status=status.HTTP_400_BAD_REQUEST)

        
        



            


#Lesson Plan Views
class LessonPlanView(APIView):
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request):
        data = request.data
        user = request.user
        teacher_id = user.UID
        role = user.role
        principal_user = CustomUser.objects.get(role='Principal')
    
        serializer = PostLessonPlanSerializer(data=data)

        if not teacher_id:
            return Response({'error':'Teacher ID is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        if role != "Teacher" and role != "TEACHER":
            return Response({'error':'Only a Teacher can create a lesson plan'}, status=status.HTTP_403_FORBIDDEN)
        
        if serializer.is_valid():
            lesson_plan = serializer.save(teacher = request.user)
            
            Notification.objects.create(
                user=principal_user,
                message=f"{user.first_name}  {user.last_name} submitted a Lesson Plan",
                link=f'http://localhost:5173/view/?planId={lesson_plan.plan_id}'
            )
            
            return Response (serializer.data,status=status.HTTP_201_CREATED)
        else:
            return Response (serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
      
    def get(self, request):
        user = request.user
        role = request.user.role

        try:
            base_queryset = LessonPlan.objects.select_related(
                        "teacher",
                        "quarter",
                        "quarter__school_year"
                )
            
            if role == "PRINCIPAL" or role == "Principal":
                queryset = base_queryset

            elif role == 'Teacher' or role == 'TEACHER':
                queryset = base_queryset.filter(teacher=user)

            else:
                return Response({"error":"Unauthorized"},status=status.HTTP_403_FORBIDDEN)
            
            school_year = request.query_params.get("school_year")

            if school_year:
                queryset = queryset.filter(quarter__school_year__year_id=school_year)
            else:
                queryset = queryset.filter(quarter__school_year__is_active=True)
                
            quarter_number = request.query_params.get("quarter")
            status_param = request.query_params.get("status")
            is_late = request.query_params.get("is_late")
            

            if quarter_number:
                queryset = queryset.filter(
                    quarter__quarter_number=quarter_number
                )

            if status_param:
                queryset = queryset.filter(
                    status__iexact=status_param
                )

            if is_late is not None:
                is_late_bool = is_late.lower() == "true"
                if is_late_bool:
                    queryset = queryset.filter(
                        created_at__gt=F("quarter__deadline")
                    )
                else:
                    queryset = queryset.filter(
                        created_at__lte=F("quarter__deadline")
                    )

            if school_year:
                queryset = queryset.filter(
                    quarter__school_year__name=school_year
                )
                
            serializer = LessonPlanSerializer(queryset, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Exception as e:
            print("Get Lesson Plan Error",e)
            return Response({'error':'Internal Server Error'},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
    
    def patch (self,request,plan_id):
        data = request.data
        user_id = request.user.UID
        

        user  = CustomUser.objects.get(UID = user_id)
        lesson_plan = get_object_or_404(LessonPlan, plan_id = plan_id)
        teacher = CustomUser.objects.get(UID = lesson_plan.teacher.UID)
        principal = CustomUser.objects.get(role = 'Principal')
        serializer = UpdateLessonPlanSerializer(lesson_plan, data=data, partial=True)

        if serializer.is_valid():
            serializer.save()
            
            lesson_plan.reviewed_at = timezone.now()
            lesson_plan.save(update_fields=["reviewed_at"])

            Notification.objects.create(
                user=teacher,
                message=f"{principal.first_name}  {principal.last_name} {data['status']} your Lesson Plan",
                link='testing'
            )

            ReviewedLessonPlan.objects.create(
                reviewed_by = user,
                lesson_plan = lesson_plan,
            )
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({serializer.errors},status=status.HTTP_400_BAD_REQUEST)

    
class ReviewedByLessonPlan(APIView):
    def post(self, request):
        data = request.data
        user_id = request.user.UID
        plan_id = self.get_object()
        serializer = UpdateLessonPlanSerializer(plan_id,data = data)

        if serializer.is_valid():
            serializer.save()
            reviewed = LessonPlan.objects.create(
                reviewed_by = user_id,
                lesson_plan = plan_id
            )
            return Response({'success':'Updated Lesson Plan Successfully'}, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)
    

class NotificationView(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    def get(self,request):
        
        user_id = request.user.UID

        try:
            if user_id:
                queryset = Notification.objects.filter(user = user_id).order_by('-created_at')
                serializer = NotificationSerializer(queryset, many=True)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response ({'error': 'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            print("Notification Error:", e)
            return Response({'error':'Internal Server Error'},status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
class NotificationPollingView(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    def get(self, request):
        user_id = request.user.UID

        try:
            if user_id:
                unseen_notif = Notification.objects.filter(user = user_id, is_sent = False)
                history_notif = Notification.objects.filter(user = user_id).order_by('-created_at')[:20]

                history_serializer = NotificationSerializer(history_notif, many=True)
                unseen_notif_serializer = NotificationSerializer(unseen_notif, many=True)

                history_data = history_serializer.data
                unseen_data = unseen_notif_serializer.data
                

                unseen_notif.update(is_sent=True)

                return Response({'unseen':unseen_data, 'history':history_data}, status=status.HTTP_200_OK)
            else:
                return Response({'error':'Unauthorized'}, status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            print(e)
            return Response({'error':'Internal Server Error'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        








# class UserRegistrationAPIView(GenericAPIView):
#     permission_classes = (permissions.AllowAny,)
#     serializer_class = UserRegistrationSerializer

#     def post(self, request, *args, **kwargs):
#         serializer = self.get_serializer(data=request.data)
#         serializer.is_valid(raise_exception=True)
#         user = serializer.save()
#         token = RefreshToken.for_user(user)
#         data = serializer.data
#         data["tokens"] = {"refresh":str(token),
#                         "access": str(token.access_token)}
#         return Response(data, status= status.HTTP_201_CREATED)
    
# class UserLoginAPIView(GenericAPIView):
#     permission_classes = (permissions.AllowAny,)
#     serializer_class = UserLoginSerializer

#     def post(self, request, *args, **kwargs):
#         serializer = self.get_serializer(data= request.data)
#         serializer.is_valid(raise_exception=True)
#         user = serializer.validated_data
#         serializer = CustomUserSerializer(user)
#         token = RefreshToken.for_user(user)
#         data = serializer.data
#         data["tokens"] = {"refresh":str(token),
#                         "access": str(token.access_token)}
#         return Response(data, status=status.HTTP_200_OK)
    


class UserInfoAPIView(RetrieveAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = CustomUserSerializer
    
    def get_object(self):
       return self.request.user
