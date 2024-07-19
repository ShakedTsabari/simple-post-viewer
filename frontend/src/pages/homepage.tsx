import Link from 'next/link'
 
export default function Login() {
  return (
    <div>
      <div>
        <h1>Create User</h1>
        <form name="create_user_form">
          <label>Name</label>
          <input type="text" name="create_user_form_name" /><br />
          <label>Email</label>
          <input type="text" name="create_user_form_email" /><br />
          <label>Username</label>
          <input type="text" name="create_user_form_username"/><br />
          <label>Password</label>
          <input type="password" name="create_user_form_password" /><br />
          <button name="create_user_form_create_user">Create User</button>
        </form>
      </div>
          <div>
          <h1>Login</h1>
          <form name="login_form">
            <label>Username</label>
            <input type="text" name="login_form_username" /><br />
            <label>Password</label>
            <input type="password" name="login_form_password" /><br />
            <button name="login_form_login">Login</button>
          </form>
        </div>
        <div>
          <h1>Logout</h1>
          <button name="logout">Logout</button>  {/*The logout will delete the token from the state.*/}

        </div>
      </div>
  )
}