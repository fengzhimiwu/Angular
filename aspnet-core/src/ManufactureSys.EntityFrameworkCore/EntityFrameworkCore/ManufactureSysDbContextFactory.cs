using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using ManufactureSys.Configuration;
using ManufactureSys.Web;

namespace ManufactureSys.EntityFrameworkCore
{
    /* This class is needed to run "dotnet ef ..." commands from command line on development. Not used anywhere else */
    public class ManufactureSysDbContextFactory : IDesignTimeDbContextFactory<ManufactureSysDbContext>
    {
        public ManufactureSysDbContext CreateDbContext(string[] args)
        {
            var builder = new DbContextOptionsBuilder<ManufactureSysDbContext>();
            var configuration = AppConfigurations.Get(WebContentDirectoryFinder.CalculateContentRootFolder());

            ManufactureSysDbContextConfigurer.Configure(builder, configuration.GetConnectionString(ManufactureSysConsts.ConnectionStringName));

            return new ManufactureSysDbContext(builder.Options);
        }
    }
}
