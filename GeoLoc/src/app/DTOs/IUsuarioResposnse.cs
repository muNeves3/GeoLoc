namespace GeoLoc.src.app.DTOs
{
    public class IUsuarioResponse
    {
        public Guid Id { get; set; }
        public string? Nome { get; set; }
        public bool EhAdministrador { get; set; }
        public string NumeroMatricula { get; set; }
    }
}
