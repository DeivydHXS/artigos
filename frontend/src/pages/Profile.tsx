import React, { useCallback, useEffect, useState, type FormEvent } from 'react';
import type { UserInterface } from '../interfaces/UserInterface';
import PageCard from '../components/PageCard';
import { TfiPencilAlt, TfiTrash } from 'react-icons/tfi';
import { useNavigate } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import FormField from '../components/FormField';
import { LOCAL_STORAGE_KEYS } from '../constants/localstorage';
import Form from '../components/Form';

const Profile: React.FC = () => {
  let navigate = useNavigate();
  const { post, del } = useApi();

  const [user, setUser] = useState<UserInterface>();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [modal, setModal] = useState<boolean>(false);

  const handleDelete = useCallback(async () => {
    await del('/user');
    navigate('/');
  }, []);

  const getUser = useCallback(() => {
    var getUserLocalStorage: UserInterface = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEYS.USER) || '');
    setUser(getUserLocalStorage);
  }, []);

  const handleSubmit = useCallback(async (form: FormEvent<HTMLFormElement>) => {
    form.preventDefault()
    const data = new FormData(form.currentTarget);
    const res = await post<UserInterface>('/user', data);

    localStorage.setItem(LOCAL_STORAGE_KEYS.USER, JSON.stringify(res.data));
    getUser();
    setIsEditing(false);
  }, []);

  useEffect(() => {
    getUser();
  }, []);

  return (
    <PageCard title="Perfil">
      <div className=''>
        <Form handleSubmit={handleSubmit} className='flex flex-col'>
          <div className='flex flex-col gap-2'>
            <div className='flex gap-2'>
              <FormField label='Nome' name='name' defaultValue={user?.name} type='name' readOnly={!isEditing}
                className={`${isEditing ? 'border-neutral focus:outline-none focus:border-primary' : 'border-neutral-desc focus:outline-none'} border rounded-md pl-2 py-1 w-full`} />
              <FormField label='Email' name='email' defaultValue={user?.email} type='email' readOnly={!isEditing}
                className={`${isEditing ? 'border-neutral focus:outline-none focus:border-primary' : 'border-neutral-desc focus:outline-none'} border rounded-md pl-2 py-1 w-full`} />
            </div>
            {isEditing ? <FormField label='Imagem de perfil' name='profile_image' type='file' /> : ''}
          </div>

          <div className="flex gap-4 mt-8">
            {isEditing ?
              <>
                <button type='button' onClick={() => setIsEditing(false)} className='bg-cancel rounded-md p-2 hover:bg-cancel-desc text-white font-semibold flex justify-center'>
                  Cancelar
                </button>
                <input type="submit" value='Salvar' className='bg-accept rounded-md p-2 hover:bg-accept-desc text-white font-semibold' />
              </>
              :
              <>
                <button onClick={() => setIsEditing(true)} className='bg-edit rounded-md p-2 hover:bg-edit-desc text-white font-semibold flex justify-center items-center'>
                  Editar
                  <TfiPencilAlt className='ml-2' />
                </button>
                <button type='button' onClick={() => setModal(true)} className='bg-cancel rounded-md p-2 hover:bg-cancel-desc text-white font-semibold'>
                  <div className="flex items-center justify-between gap-2">
                    <p>
                      Excluir
                    </p>
                    <div>
                      <TfiTrash />
                    </div>
                  </div>
                </button>
              </>
            }
          </div>
        </Form>
      </div>
      <div className='absolute top-0 left-0 w-full h-full bg-opacity-50 flex items-center justify-center z-1' style={{ display: modal ? 'flex' : 'none' }}>
        <div className='bg-black opacity-75 h-screen w-screen absolute z-2'></div>
        <div className='bg-white p-8 rounded-md border-b-1 border-b-neutral flex flex-col gap-2 z-3'>
          <h1 className='text-center'>Excluir conta</h1>
          <p className='text-center'>Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.</p>
          <div className='flex gap-2 mt-4'>
            <button onClick={() => setModal(false)} className='bg-cancel rounded-md p-2 hover:bg-cancel-desc text-white font-semibold flex justify-center'>
              <p>Cancelar</p>
            </button>
            <button onClick={handleDelete} className='bg-accept rounded-md p-2 hover:bg-accept-desc text-white font-semibold flex justify-center'>
              <p>Confirmar</p>
            </button>
          </div>
        </div>
      </div>
    </PageCard>
  );
};

export default Profile;
