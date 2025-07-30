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
        public Task AssociarCentroEdificio(int id_centro, int id_edificio)
        {
            try 
            {
                if (id_centro <= 0 || id_edificio <= 0)
                {
                    throw new ArgumentException("IDs devem ser maiores que zero.");
                }
                // Implementar lógica de associação no Supabase
                // Exemplo: Inserir na tabela de associação entre centros e edifícios
                return Task.CompletedTask; // Retornar uma tarefa concluída
            }
            catch (Exception ex)
            {
                // Tratar exceções específicas do Supabase ou gerais
                throw new InvalidOperationException("Erro ao associar centro e edifício.", ex);
            }
        }

        public Task DesassociarCentroEdificio(int id_centro, int id_edificio)
        {
            try
            {
                if (id_centro <= 0 || id_edificio <= 0)
                {
                    throw new ArgumentException("IDs devem ser maiores que zero.");
                }
                // Implementar lógica de desassociação no Supabase
                // Exemplo: Remover da tabela de associação entre centros e edifícios
                return Task.CompletedTask; // Retornar uma tarefa concluída
            }
            catch (Exception ex)
            {
                // Tratar exceções específicas do Supabase ou gerais
                throw new InvalidOperationException("Erro ao desassociar centro e edifício.", ex);
            }
        }

        public Task<List<int>> ListarCentrosPorEdificio(int id_edificio)
        {
            try
            {
                if (id_edificio <= 0)
                {
                    throw new ArgumentException("ID do edifício deve ser maior que zero.");
                }
                // Implementar lógica para listar centros por edifício no Supabase
                // Exemplo: Consultar a tabela de associação entre centros e edifícios
                return Task.FromResult(new List<int>()); // Retornar uma lista vazia como exemplo
            }
            catch (Exception ex)
            {
                // Tratar exceções específicas do Supabase ou gerais
                throw new InvalidOperationException("Erro ao listar centros por edifício.", ex);
            }
        }

        public Task<List<int>> ListarEdificiosPorCentro(int id_centro)
        {
            try
            {
                if (id_centro <= 0)
                {
                    throw new ArgumentException("ID do centro deve ser maior que zero.");
                }
                // Implementar lógica para listar centros por edifício no Supabase
                // Exemplo: Consultar a tabela de associação entre centros e edifícios
                return Task.FromResult(new List<int>()); // Retornar uma lista vazia como exemplo
            }
            catch (Exception ex)
            {
                // Tratar exceções específicas do Supabase ou gerais
                throw new InvalidOperationException("Erro ao listar edificios por centro.", ex);
            }
        }
    }
}
