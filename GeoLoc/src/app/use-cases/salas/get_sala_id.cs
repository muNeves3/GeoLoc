using GeoLoc.src.app.DTOs;
using GeoLoc.src.app.repositories;

namespace GeoLoc.src.app.use_cases.salas
{
    public class get_sala_id
    {
        private readonly ISalaRepository _salaRepository;

        public get_sala_id(ISalaRepository salaRepository)
        {
            _salaRepository = salaRepository;
        }

        public async Task<ISalaResponse> Execute(Guid id)
        {
            if (id == Guid.Empty)
            {
                throw new ArgumentException("ID da sala não pode ser vazio.", nameof(id));
            }
            var sala = await _salaRepository.GetByIdAsync(id);
            if (sala == null)
            {
                throw new KeyNotFoundException($"Sala com ID {id} não encontrada.");
            }
            return sala;
        }
    }
}
