import StunningAuth from '../../components/StunningAuth';

export const metadata = {
  title: 'Sign In - Habit Tracker',
  description: 'Sign in to your habit tracker account',
};

export default function SignInPage() {
  return <StunningAuth mode="signin" />;
}
