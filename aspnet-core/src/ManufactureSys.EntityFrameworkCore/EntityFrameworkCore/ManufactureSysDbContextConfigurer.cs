using System.Data.Common;
using Microsoft.EntityFrameworkCore;

namespace ManufactureSys.EntityFrameworkCore
{
    public static class ManufactureSysDbContextConfigurer
    {
        public static void Configure(DbContextOptionsBuilder<ManufactureSysDbContext> builder, string connectionString)
        {
            builder.UseMySql(connectionString);
        }

        public static void Configure(DbContextOptionsBuilder<ManufactureSysDbContext> builder, DbConnection connection)
        {
            builder.UseMySql(connection);
        }
    }
}
