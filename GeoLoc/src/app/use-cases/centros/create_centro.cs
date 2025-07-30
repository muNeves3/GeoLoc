using GeoLoc.src.app.DTOs;
using GeoLoc.src.app.repositories;

namespace GeoLoc.src.app.use_cases.centros
{
    public class create_centro
    {
        private readonly ICentroRepository repository;

        public create_centro(ICentroRepository repository)
        {
            this.repository = repository;
        }

        public async Task<ICentroResponse> execute(ICentroRequest centro)
        {
            ICentroResponse created = await this.repository.Create(centro);
            return created;
        }
    }
}
