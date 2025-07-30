using GeoLoc.src.app.DTOs;
using GeoLoc.src.app.models;
using GeoLoc.src.app.repositories;

namespace GeoLoc.src.infra.database.supabase
{
    public class centro_repository : ICentroRepository
    {
        private readonly Supabase.Client _client;

        public centro_repository(Supabase.Client client)
        {
            _client = client;
        }

        public async Task<ICentroResponse> Create(ICentroRequest centro)
        {
            var novoCentro = new Centro
            {
                nome = centro.nome,
                descricao = centro.descricao,
                sigla = centro.sigla,
            };
            try
            {
                var response = await _client
                    .From<Centro>()
                    .Insert(novoCentro);
                var centroCriado = response.Models.First();
                var centroReturn = new ICentroResponse
                {
                    Id = centroCriado.id.ToString(),
                    Nome = centroCriado.nome,
                    Descricao = centroCriado.descricao,
                    Sigla = centroCriado.sigla
                };
                return centroReturn;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error creating centro: {ex.Message}");
                throw;
            }
        }

        public async Task<List<ICentroResponse>> GetAll()
        {
            try
            {
                var response = await _client
                    .From<Centro>()
                    .Get();
                var centros = response.Models.Select(c => new ICentroResponse
                {
                    Id = c.id.ToString(),
                    Nome = c.nome,
                    Descricao = c.descricao,
                    Sigla = c.sigla
                }).ToList();
                return centros;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error getting all centros: {ex.Message}");
                throw;

            }
        }
    }
}
