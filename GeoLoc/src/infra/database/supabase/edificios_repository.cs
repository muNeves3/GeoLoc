using GeoLoc.src.app.DTOs;
using GeoLoc.src.app.models;
using GeoLoc.src.app.repositories;

namespace GeoLoc.src.infra.database.supabase
{
    public class edificios_repository : IEdificioRepository
    {
        private readonly Supabase.Client _client;
        public edificios_repository(Supabase.Client client)
        {
            _client = client ?? throw new ArgumentNullException(nameof(client), "Supabase client cannot be null");
        }
        public async Task<IEdificioResponse> Create(IEdificioRequest edificio)
        {
            if (edificio == null)
            {
                throw new ArgumentNullException(nameof(edificio), "Edificio request cannot be null");
            }

            try
            {
                var edificioModel = new Edificio
                {
                    Nome = edificio.Nome,
                    Descricao = edificio.Descricao,
                    Latitude = edificio.Latitude,
                    Longitude = edificio.Longitude,
                    TipoLocal = edificio.TipoLocal
                };

                var response = await _client.From<Edificio>().Insert(edificioModel);
                var createdEdificio = response.Models.FirstOrDefault();
                if (createdEdificio == null)
                {
                    throw new Exception("Failed to create edificio in Supabase");
                }
                return new IEdificioResponse
                {
                    Id = createdEdificio.Id,
                    Nome = createdEdificio.Nome,
                    Descricao = createdEdificio.Descricao,
                    Latitude = createdEdificio.Latitude,
                    Longitude = createdEdificio.Longitude,
                    TipoLocal = createdEdificio.TipoLocal
                };
            }
            catch (Exception ex)
            {
                throw new Exception("Error creating edificio in Supabase", ex);

            }
        }

        public async Task<List<IEdificioResponse>> GetAll()
        {
            try
            {
                var response = await _client.From<Edificio>().Get();
                return response.Models.Select(e => new IEdificioResponse
                {
                    Id = e.Id,
                    Nome = e.Nome,
                    Descricao = e.Descricao,
                    Latitude = e.Latitude,
                    Longitude = e.Longitude,
                    TipoLocal = e.TipoLocal
                }).ToList();
            }
            catch (Exception ex)
            {
                throw new Exception("Error retrieving edificios from Supabase", ex);
            }
        }
    }
}
