from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

# Create your models here.
class amphi(models.Model):
    name =models.CharField(max_length=100,unique=True, null=True)
    
   





class teacher(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE,default=1) 
    
    code= models.CharField(max_length=15,unique=True, null=True)
    department=models.CharField(max_length=15,null=True)
    phone=models.CharField(max_length=15,null=True)
    




class history(models.Model):
    teacher = models.ForeignKey(teacher, on_delete=models.CASCADE)
    amphi = models.ForeignKey(amphi, on_delete=models.CASCADE)
    date = models.DateField(default=timezone.now)
    time= models.TimeField(default=timezone.now)
