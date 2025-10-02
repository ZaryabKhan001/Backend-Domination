import { gql } from '@apollo/client';
import { useQuery, useLazyQuery, useMutation } from '@apollo/client/react';
import { getUsers, getCourses } from './graphql/queries/index';
import { createUser } from './graphql/mutations/index';
import { useState, type FormEvent } from 'react';

function App() {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');

  const {
    data: usersData,
    loading: usersLoading,
    error: usersError,
  } = useQuery(gql(getUsers));

  const [
    trigger,
    { error: coursesError, data: coursesData, loading: coursesLoading },
  ] = useLazyQuery(gql(getCourses));

  type CreateUserResponseType = {
    newUser?: string;
  };

  const [triggerr, { data: createUserResponse, error: createUserError }] =
    useMutation<CreateUserResponseType>(gql(createUser));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await triggerr({ variables: { name, email } });
      console.log('createUserResponse', createUserResponse);
    } catch (error) {
      console.log('createUserError', createUserError || error);
    } finally {
      setName('');
      setEmail('');
    }
  };

  console.log('usersData', usersData);
  console.log('coursesData', coursesData);

  if (usersError) return <h1>{usersError?.message}</h1>;

  if (usersLoading) return <h1>Loading...</h1>;

  return (
    <div>
      App
      <br />
      <br />
      <button onClick={() => trigger()} disabled={coursesLoading}>
        View Courses
      </button>
      {coursesError && <p>{coursesError?.message}</p>}
      <br />
      <br />
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          placeholder='Name'
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <br />
        <br />
        <input
          type='email'
          placeholder='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <br />
        <button type='submit'>Submit</button>
        <br />
        {createUserResponse && <p>{createUserResponse?.newUser}</p>}
        {createUserError && <p>{createUserError.message}</p>}
      </form>
    </div>
  );
}

export default App;
