import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import {useForm} from "react-hook-form"
import {Form,FormControl,FormField,FormItem,FormLabel,FormMessage,} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { SignupValidation } from "@/lib/validation"
import {z} from "zod"
import Loader from "@/components/shared/Loader"
import { Link, useNavigate } from "react-router-dom"
import { useToast } from "@/components/ui/use-toast"
import { useCreateUserAccount, useSignInAccount } from "@/lib/react-query/queriesAndMutations"
import { useUserContext } from "@/context/AuthContext"

 
function SignupForm() {
  const { toast } = useToast()
  const {checkAuthUser, isLoading: isUserLoading} = 
  useUserContext();
  const navigate = useNavigate();
  

  const {mutateAsync: createUserAccount, isPending: isCreatingUser} = useCreateUserAccount();

  const {mutateAsync: signInAccount, isPending: isSigningIn} = useSignInAccount()

  // 1. Define your form.
  const form = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      name: '',
      username: "",
      email: '',
      password: ''
    },
  })


 
  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof SignupValidation>) {
    const newUser = await createUserAccount(values);

    if(!newUser) {
      return toast({
        title: "Sign up failed. Please try again.",
      })
    }

    const session = await signInAccount({
      email: values.email,
      password: values.password,
    })

    if(!session) {
      return toast({title: 'Sign in failed. Please try again.'})
    }

    const isLoggedIn = await checkAuthUser();

    if(isLoggedIn) {
      form.reset();
      navigate('/')
    }
    else {
      return toast({title: 'Sign up failed. Please try again.'})
    }
    
  }

  return (
    <Form{...form}>
      <div className="sm:w-420 flex-center flex-col">
        <img className="justify-center" src="/assets/images/logo.svg" alt="logo"/>
        <h2 className="h3-bold md:h2-bold pt-5 sm:pt-12 text-white text-center">
          Create a new account
        </h2>
        <p className=" text-light-3 small-medium md:base-regular mt-2 text-gray-500">To use Snapgram, please enter your details</p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-5 w-full mt-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Name</FormLabel>
              <FormControl>
                <Input type="text" className="bg-gray-950 text-gray-400" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Username</FormLabel>
              <FormControl>
                <Input type="text" className="bg-gray-950 text-gray-400"  {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Email</FormLabel>
              <FormControl>
                <Input type="email" className="bg-gray-950 text-gray-400" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">Password</FormLabel>
              <FormControl>
                <Input type="password" className="bg-gray-950 text-gray-400" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="bg-pink-500">
          {isCreatingUser ? (
            <div className="flex-center gap-2">
              <Loader/>
            </div>
          ) : "Sign up"}
          </Button>
          <p className="text-small-regular text-light-2 text-center mt-2 text-gray-500">
            Already have an account?
            <Link to="/sign-in" className="text-primary-500 text-gray-700 text-small-semibold ml-1">Log in</Link>
          </p>
      </form>
    </Form>
  )
}

export default SignupForm


