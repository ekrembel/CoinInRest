using System;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace CoinInRest.Models
{
    public class CoinDbContext : IdentityDbContext<ApplicationUser>
    {
        public DbSet<Bought> Boughts { get; set; }
        public DbSet<ApplicationUser> ApplicationUsers { get; set; }
        public DbSet<Feedback> Feedbacks { get; set; }
        public DbSet<Sold> Solds { get; set; }
        public DbSet<Company> Companies { get; set; }

        public CoinDbContext()
        {

        }

        public CoinDbContext(DbContextOptions<CoinDbContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<Bought>().ToTable("Boughts");
            modelBuilder.Entity<ApplicationUser>().ToTable("ApplicationUsers");
            modelBuilder.Entity<Feedback>().ToTable("Feedbacks");
            modelBuilder.Entity<Sold>().ToTable("Solds");
            modelBuilder.Entity<Company>().ToTable("Companies");
        }
    }
}
