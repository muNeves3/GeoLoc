using Supabase.Postgrest.Attributes;
using Supabase.Postgrest.Models;

namespace GeoLoc.src.app.models
{
    [Table("centros")]
    public class Centro : BaseModel
    {
        [PrimaryKey("id", false)]
        public Guid id { get; set; }
        [Column("nome")]
        public string nome { get; set; }
        [Column("descricao")]
        public string descricao { get; set; }
        [Column("sigla")]
        public string sigla { get; set; }
    }
}
