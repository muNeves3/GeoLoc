namespace GeoLoc.src.app.DTOs
{
    public class IUsuarioRequest
    {
        public string nome { get; set; }
        public bool eh_administrador { get; set; }
        public string senha { get; set; }
        public string numero_matricula { get; set; }
    }
}
