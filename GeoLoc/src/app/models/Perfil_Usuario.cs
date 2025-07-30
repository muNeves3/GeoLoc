using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace GeoLoc.src.app.Models
{
    [Table("perfil_usuarios")]
    public class Perfil_Usuario : BaseModel
    {
        [PrimaryKey("id", false)]
        public Guid id { get; set; }

        [Column("nome")]
        public string nome { get; set; }
        [Column("eh_administrador")]
        public bool eh_administrador { get; set; }
        [Column("senha")]
        public string senha { get; set; }
        [Column("numero_matricula")]
        public string numero_matricula { get; set; }
    }

}
