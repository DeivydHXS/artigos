export const Loading: React.FC = () => {
    return( 
        <div className='flex flex-col justify-center items-center h-60'>
            <div className="animate-spin rounded-full h-10 w-10 border-l-2 border-l-primary "></div>
            <p className='text-gray-500 text-lg ml-4 mt-4'>Carregando...</p>
        </div>
    )
}