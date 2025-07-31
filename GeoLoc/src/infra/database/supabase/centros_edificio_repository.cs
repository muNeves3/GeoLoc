using GeoLoc.src.app.DTOs;
using GeoLoc.src.app.models;
using GeoLoc.src.app.repositories;

namespace GeoLoc.src.infra.database.supabase
{
    public class centros_edificio_repository : ICentroEdificioRepository
    {

        private readonly Supabase.Client _client;

        public centros_edificio_repository(Supabase.Client client)
        {
            _client = client ?? throw new ArgumentNullException(nameof(client), "Supabase Client não pode ser nulo.");
        }
        public async Task AssociarCentroEdificio(string id_centro, string id_edificio)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(id_centro) || string.IsNullOrWhiteSpace(id_edificio))
                {
                    throw new ArgumentException("IDs devem ser válidos e não nulos.");
                }
                // Se não encontrou, insere

                var novoCentroEdificio = new Centro_Edificio
                {
                    id_centro = new Guid(id_centro),
                    id_edificio = new Guid(id_edificio)
                };
                var resultado = await _client.From<Centro_Edificio>().Upsert(novoCentroEdificio);
                if (!resultado.ResponseMessage.IsSuccessStatusCode)
                {
                    var errorContent = await resultado.ResponseMessage.Content.ReadAsStringAsync();
                    throw new InvalidOperationException($"Erro ao executar Upsert no Supabase: {errorContent}");
                }
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException("Erro ao associar centro e edifício.", ex);
            }
        }

        public Task DesassociarCentroEdificio(string id_centro, string id_edificio)
        {
            try
            {
                if (id_centro == null || id_edificio == null)
                {
                    throw new ArgumentException("IDs devem ser válidos e não nulos.");
                }

                var queryExiste = _client.From<Centro_Edificio>()
                  .Select("id_centro, id_edificio")
                  .Where(cte => cte.id_centro == new Guid(id_centro) && cte.id_edificio == new Guid(id_edificio))
                  .Single();

                if (queryExiste == null)
                    return Task.CompletedTask;

                var novoCentroEdificio = new Centro_Edificio();
                novoCentroEdificio.id_centro = new Guid(id_centro);
                novoCentroEdificio.id_edificio = new Guid(id_edificio);
                return _client.From<Centro_Edificio>().Delete(novoCentroEdificio);
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException("Erro ao desassociar centro e edifício.", ex);
            }
        }

        public async Task<List<Centro_Edificio>> ListarCentrosPorEdificio(string id_edificio)
        {
            try
            {
                if (id_edificio == null)
                {
                    throw new ArgumentException("ID do edifícionão não pode ser nulo.");
                }

                var query = await _client.From<Centro_Edificio>()
                    .Select("id_centro")
                    .Where(cte => cte.id_edificio == new Guid(id_edificio))
                    .Get();

                return query.Models;
            }
            catch (Exception ex)
            {
                throw new InvalidOperationException("Erro ao listar centros por edifício.", ex);
            }
        }

        public async Task<List<Centro_Edificio>> ListarEdificiosPorCentro(string id_centro)
        {
            try
            {
                if (id_centro == null)
                {
                    throw new ArgumentException("ID do centro não pode ser nulo.");
                }
                var query = await _client.From<Centro_Edificio>()
                    .Select("id_centro")
                    .Where(cte => cte.id_centro == new Guid(id_centro))
                    .Get();

                return query.Models;
            }
            catch (Exception ex)
            {
                // Tratar exceções específicas do Supabase ou gerais
                throw new InvalidOperationException("Erro ao listar edificios por centro.", ex);
            }
        }
    }
}
