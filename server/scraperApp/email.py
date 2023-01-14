from djoser import email


class ActivationEmail(email.ActivationEmail):
    template_name = 'activation.html'
    

class PasswordResetEmail(email.PasswordResetEmail):
    template_name = 'reset-password.html'
    