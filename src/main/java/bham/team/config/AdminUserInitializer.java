package bham.team.config;

import bham.team.domain.Authority;
import bham.team.domain.User;
import bham.team.repository.AuthorityRepository;
import bham.team.repository.UserRepository;
import jakarta.annotation.PostConstruct;
import java.util.Set;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class AdminUserInitializer {

    private final UserRepository userRepository;
    private final AuthorityRepository authorityRepository;
    private final PasswordEncoder passwordEncoder;

    public AdminUserInitializer(UserRepository userRepository, AuthorityRepository authorityRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.authorityRepository = authorityRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @PostConstruct
    public void init() {
        userRepository
            .findOneByLogin("admin")
            .ifPresentOrElse(
                user -> System.out.println("✅ Admin user already exists."),
                () -> {
                    User user = new User();
                    user.setLogin("admin");
                    user.setPassword(passwordEncoder.encode("admin"));
                    user.setFirstName("Admin");
                    user.setLastName("User");
                    user.setEmail("admin@example.com");
                    user.setActivated(true);
                    user.setLangKey("en");

                    Authority adminAuthority = authorityRepository
                        .findById("ROLE_ADMIN")
                        .orElseGet(() -> {
                            Authority authority = new Authority();
                            authority.setName("ROLE_ADMIN");
                            return authorityRepository.save(authority);
                        });

                    Authority userAuthority = authorityRepository
                        .findById("ROLE_USER")
                        .orElseGet(() -> {
                            Authority authority = new Authority();
                            authority.setName("ROLE_USER");
                            return authorityRepository.save(authority);
                        });

                    user.setAuthorities(Set.of(adminAuthority, userAuthority));
                    userRepository.save(user);
                    System.out.println("✅ Created admin user with username 'admin' and password 'admin'");
                }
            );
    }
}
