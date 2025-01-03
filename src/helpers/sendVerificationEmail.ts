import VerificationEmail from "../../emails/VerificationEmail";
import { ApiResponse } from '@/types/ApiResponse';
import { Resend } from "resend";

const resend = new Resend("re_2m23ARkU_Gn8bE4MQLPy5CUg8ioBxKM9p");
export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    const response = await resend.emails.send({
      from: 'Mystery Message <onboarding@resend.dev>',
      to: email,
      subject: 'Mystery Message Verification Code',
      react: VerificationEmail({ username, otp: verifyCode }),
    });
    if (response.data?.id) {
      return { success: true, message: 'Verification email sent successfully.' };
    }
    return { success: false, message: 'Failed to send verification email.' };
  } catch (emailError) {
    console.error('Error sending verification email:', emailError);
    return { success: false, message: 'Failed to send verification email.' };
  }
}