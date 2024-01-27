using Microsoft.EntityFrameworkCore;
using server.Entities;

public class SpeedTyperDbContext : DbContext
{
    public SpeedTyperDbContext(DbContextOptions<SpeedTyperDbContext> options): base(options)
    {
    }

    public DbSet<Score> Scores { get; set; }
    public DbSet<User> Users { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<User>().HasData(new User
        {
            Id = 1,
            FirstName = "James",
            LastName = "Huang",
            Email = "jameshuang@gmail.com",
            Username = "Klaw",
            Password = "123"
        });
    }

}