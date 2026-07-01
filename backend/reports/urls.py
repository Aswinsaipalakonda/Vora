from django.urls import path
from .views import SalesReportView, StaffReportView, InventoryReportView, GenericReportView, ReportCategoriesView, DashboardView

urlpatterns = [
    path('', SalesReportView.as_view(), name='sales-reports'),
    path('staff/', StaffReportView.as_view(), name='staff-reports'),
    path('inventory/', InventoryReportView.as_view(), name='inventory-reports'),
    path('generic/', GenericReportView.as_view(), name='generic-report'),
    path('categories/', ReportCategoriesView.as_view(), name='report-categories'),
    path('dashboard/', DashboardView.as_view(), name='dashboard'),
]
