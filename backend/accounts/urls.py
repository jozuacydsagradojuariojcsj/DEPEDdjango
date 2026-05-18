from django.urls import path, include
from . import views
from rest_framework_simplejwt.views import TokenRefreshView


urlpatterns = [
    path('djoser/',include('djoser.urls')),
    # path('auth/',include('djoser.urls.jwt')),
    path("logout/", views.UserLogoutAPIView.as_view(), name="logout-user"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token-refresh"),
    path("schoolyear/", views.SchoolYearView.as_view(), name="school-year"),
    path("setschoolyear/<uuid:year_id>/", views.SchoolYearView.as_view(), name="school-year-update"),
    path("quarter/<uuid:year_id>", views.QuarterView.as_view(), name="quarter-view"),
    path("quarter/update/", views.QuarterView.as_view(), name="quarter-update"),
    path("count/", views.CountView.as_view(), name="teacher-count"),
    path("lessonplan/",views.LessonPlanView.as_view(), name="lesson-plan"),
    path("reviewlessonplan/<uuid:plan_id>/",views.LessonPlanView.as_view(),name="review-lesson-plan"),
    path("verify/certificate/<uuid:code>",views.VerifyCertificateView.as_view(), name="verify-qr"),
    path("user/", views.UserInfoAPIView.as_view(), name="current-user"),
    path("auth/jwt/create/",views.CreateTokenAPIView.as_view(), name="login-user"),
    path("auth/jwt/refresh/",views.CreateAccessTokenRefreshView.as_view(),name="access-via-refresh-token"),
    path("notifications/",views.NotificationView.as_view(), name="notifications"),
    path("polling_notifications/",views.NotificationPollingView.as_view(), name="polling")
    # path("register/", views.UserRegistrationAPIView.as_view(), name="register-user"),
    # path("login/", views.UserLoginAPIView.as_view(), name="login-user"),
]