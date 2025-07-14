from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from django.contrib.auth.models import User
from .models import teacher
import json

@csrf_exempt
def upload_teachers(request):
    if request.method != "POST":
        return JsonResponse({"error": "POST request required"}, status=405)

    try:
        data = json.loads(request.body)
        teachers = data.get("teachers", [])
    except Exception as e:
        return JsonResponse({"error": f"Invalid JSON: {str(e)}"}, status=400)

    if not isinstance(teachers, list):
        return JsonResponse({"error": "'teachers' must be a list"}, status=400)

    success, errors = 0, []

    for idx, t in enumerate(teachers, start=1):
        email = t.get("email")
        first = t.get("firstName")
        last = t.get("lastName")
        code = t.get("code")
        department = t.get("department", "")
        phone = t.get("phone", "")

        if not all([email, first, last, code]):
            errors.append(f"Row {idx}: missing fields")
            continue

        try:
            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    "username": email.split("@")[0],
                    "first_name": first,
                    "last_name": last,
                    "password": "temporary"  # never use in production
                }
            )

            teacher.objects.update_or_create(
                user=user,
                defaults={"code": code, "department": department,"phone":phone}
            )
            success += 1
        except Exception as e:
            errors.append(f"Row {idx}: {str(e)}")

    return JsonResponse({
        "message": f"{success} teachers created/updated.",
        "errors": errors
    })

    
from rest_framework.views import APIView
from rest_framework.response import Response
from .models import teacher
from .serializers import TeacherMinimalSerializer

class TeacherListView(APIView):
    def get(self, request):
        teachers = teacher.objects.all()
        serializer = TeacherMinimalSerializer(teachers, many=True)
        return Response(serializer.data)