using GeoLoc.src.app.DTOs;
using GeoLoc.src.app.models;
using GeoLoc.src.app.repositories;

namespace GeoLoc.src.infra.database.supabase
{
    public class salas_repository : ISalaRepository
    {
        private readonly Supabase.Client _client;
        public salas_repository(Supabase.Client client)
        {
            _client = client ?? throw new ArgumentNullException(nameof(client), "Supabase client cannot be null");
        }
        public async Task<ISalaResponse> Create(ISalaRequest salaRequest)
        {
            if (salaRequest == null)
            {
                throw new ArgumentNullException(nameof(salaRequest), "Sala request cannot be null");
            }

            var sala = new Sala
            {
                Nome = salaRequest.Nome,
                Descricao = salaRequest.Descricao,
                IdEdificio = salaRequest.IdEdificio,
                Andar = salaRequest.Andar,
                Latitude = salaRequest.Latitude,
                Longitude = salaRequest.Longitude,
                Numero = salaRequest.Numero
            };

            try
            {
                var response = await _client.From<Sala>().Insert(sala);

                var createdSala = response.Models.FirstOrDefault();
                if (createdSala == null)
                {
                    throw new Exception("Failed to create sala in Supabase");
                }

                var salaResponse = new ISalaResponse
                {
                    Id = createdSala.Id,
                    Nome = createdSala.Nome,
                    Descricao = createdSala.Descricao,
                    IdEdificio = createdSala.IdEdificio,
                    Andar = createdSala.Andar,
                    Latitude = createdSala.Latitude,
                    Longitude = createdSala.Longitude,
                    Numero = createdSala.Numero
                };

                return salaResponse;

            }
            catch (Exception ex)
            {
                throw new Exception("Error creating sala in Supabase", ex);
            }
        }
        public async Task<List<ISalaResponse>> GetSalasEdificio(string idEdificio)
        {
            if (idEdificio != null)
            {
                throw new ArgumentException("Edificio ID must be greater than zero.", nameof(idEdificio));
            }
           var salas = await _client
                .From<Sala>()
                .Where(s => s.IdEdificio.ToString() == idEdificio)
                .Get();
            if (salas.Models == null || !salas.Models.Any())
            {
                return new List<ISalaResponse>();
            }
            return salas.Models.Select(s => new ISalaResponse
            {
                Id = s.Id,
                Nome = s.Nome,
                Descricao = s.Descricao,
                IdEdificio = s.IdEdificio,
                Andar = s.Andar,
                Latitude = s.Latitude,
                Longitude = s.Longitude,
                Numero = s.Numero
            }).ToList();
        }

        public async Task<ISalaResponse> GetByIdAsync(Guid id)
        {
            if (id == Guid.Empty)
            {
                throw new ArgumentException("ID cannot be empty.", nameof(id));
            }
            // Corrigido: buscar sala pelo filtro de Id, pois .Get espera CancellationToken
            var response = await _client
                .From<Sala>()
                .Where(s => s.Id == id)
                .Get();

            if (response.Models == null || !response.Models.Any())
            {
                return null;
            }
            var sala = response.Models.FirstOrDefault();
            return new ISalaResponse
            {
                Id = sala.Id,
                Nome = sala.Nome,
                Descricao = sala.Descricao,
                IdEdificio = sala.IdEdificio,
                Andar = sala.Andar,
                Latitude = sala.Latitude,
                Longitude = sala.Longitude,
                Numero = sala.Numero
            };
        }
    }
}
