using GeoLoc.src.app.DTOs;
using GeoLoc.src.app.Models;
using GeoLoc.src.app.repositories;

namespace GeoLoc.src.infra.database.supabase
{
    public class perfil_usuario_repository : IPerfilUsuarioRepository
    {
        private readonly Supabase.Client _client;

        public perfil_usuario_repository(Supabase.Client client)
        {
            _client = client;
        }

        public async Task<IUsuarioResponse> Create(IUsuarioRequest perfil)
        {
            var novoPerfil = new Perfil_Usuario
            {
                nome = perfil.nome,
                eh_administrador = perfil.eh_administrador,
                senha = perfil.senha,
                numero_matricula = perfil.numero_matricula
            };

            try
            {
                var response = await _client
                 .From<Perfil_Usuario>()
                 .Insert(novoPerfil);

                var perfilCriado = response.Models.First();

                var perfilReturn = new IUsuarioResponse
                {
                    Id = perfilCriado.id,
                    Nome = perfilCriado.nome,
                    EhAdministrador = perfilCriado.eh_administrador,
                    NumeroMatricula = perfilCriado.numero_matricula
                };

                return perfilReturn;
            }
            catch (Exception ex)
            {
                // Log the exception or handle it as needed
                Console.WriteLine($"Error creating perfil: {ex.Message}");
                throw;

            }
        }
    }
}
