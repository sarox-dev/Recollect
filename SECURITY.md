# Security Policy

## 🔒 Security Overview

At Recollect, security is a top priority. We are committed to ensuring the security of our users and their data. This document outlines our security practices, how to report security vulnerabilities, and our response procedures.

## 🚨 Reporting Security Vulnerabilities

If you discover a security vulnerability in Recollect, please help us by reporting it responsibly.

### 📧 How to Report

**Please DO NOT report security vulnerabilities through public GitHub issues.**

Instead, please report security vulnerabilities by emailing:
- **Email**: [security@recollect.dev](mailto:security@recollect.dev)
- **Subject**: `[SECURITY] Vulnerability Report - Recollect`

### 📋 What to Include

When reporting a security vulnerability, please include:

1. **Description**: A clear description of the vulnerability
2. **Impact**: Potential impact and severity
3. **Steps to Reproduce**: Detailed steps to reproduce the issue
4. **Proof of Concept**: Code or screenshots demonstrating the vulnerability
5. **Environment**: Your setup (OS, Docker version, etc.)
6. **Contact Information**: How we can reach you for follow-up

### ⏱️ Response Timeline

We will acknowledge your report within **48 hours** and provide a more detailed response within **7 days** indicating our next steps.

We will keep you informed about our progress throughout the process of fixing the vulnerability.

## 🛡️ Security Measures

### Current Security Practices

#### 🔐 Data Protection
- **No User Data Storage**: Recollect does not store user search queries or personal data
- **Ephemeral Processing**: All searches are processed in-memory only
- **No Tracking**: No analytics or tracking of user behavior

#### 🐳 Container Security
- **Minimal Base Images**: Using official, minimal Docker images
- **Non-root Users**: Applications run as non-privileged users
- **Regular Updates**: Dependencies kept up-to-date
- **Image Scanning**: Automated vulnerability scanning (planned)

#### 🌐 Network Security
- **Local Binding**: SearXNG bound to localhost by default
- **Firewall Configuration**: Clear guidance for secure deployment
- **HTTPS Support**: SSL/TLS configuration instructions

#### 🔧 Application Security
- **Input Validation**: All inputs validated and sanitized
- **Error Handling**: Sensitive information not exposed in errors
- **Dependency Management**: Regular security audits of dependencies

## 📊 Vulnerability Classification

We use the following severity levels:

### 🔴 Critical
- Remote code execution
- Privilege escalation
- Data breaches
- System compromise

### 🟠 High
- SQL injection
- Cross-site scripting (XSS)
- Authentication bypass
- Significant data exposure

### 🟡 Medium
- Information disclosure
- Cross-site request forgery (CSRF)
- Security misconfigurations
- Denial of service

### 🟢 Low
- Minor information leaks
- Best practice violations
- Cosmetic issues

## 🔄 Security Update Process

### 1. Vulnerability Confirmed
- Security team validates the report
- Severity assessment conducted
- Impact analysis performed

### 2. Fix Development
- Develop and test security fix
- Ensure no regressions
- Coordinate with maintainers

### 3. Release Process
- Prepare security advisory
- Coordinate disclosure timing
- Release fix and advisory simultaneously

### 4. Post-Mortem
- Analyze root cause
- Improve security processes
- Update documentation

## 📢 Security Advisories

Security advisories will be published through:
- **GitHub Security Advisories**: For detailed technical information
- **Release Notes**: For user-facing information
- **Security Mailing List**: For critical updates (planned)

## 🛠️ Security Best Practices for Users

### Deployment Security
```bash
# Use strong firewall rules
sudo ufw default deny incoming
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443

# Run containers with limited privileges
docker compose up -d

# Use HTTPS in production
# Follow SSL configuration in deployment guide
```

### Configuration Security
```bash
# Don't expose SearXNG publicly
# Keep SEARXNG_PORT bound to localhost

# Use strong passwords for any future authentication
# Regularly update Docker images

# Monitor logs for suspicious activity
docker compose logs -f | grep -i error
```

### Network Security
- Deploy behind a reverse proxy (nginx/caddy)
- Use SSL/TLS certificates
- Implement rate limiting
- Regular security updates

## 🔍 Security Audits

### Planned Security Initiatives
- **Third-party Audit**: Professional security audit (Q3 2026)
- **Bug Bounty Program**: Public bug bounty (Q4 2026)
- **Automated Scanning**: Continuous vulnerability scanning
- **Dependency Monitoring**: Automated dependency updates

### Past Security Reviews
- **Code Review**: All PRs reviewed for security implications
- **Dependency Scanning**: Regular checks for vulnerable dependencies
- **Container Scanning**: Image vulnerability assessments

## 📞 Contact Information

### Security Team
- **Primary Contact**: [security@recollect.dev](mailto:security@recollect.dev)
- **Response Time**: Within 48 hours
- **PGP Key**: Available upon request

### General Support
- **Issues**: [GitHub Issues](https://github.com/sarox-dev/Recollect/issues)
- **Discussions**: [GitHub Discussions](https://github.com/sarox-dev/Recollect/discussions)
- **Discord**: [Community Chat](https://discord.gg/BXEDCJP7mT)

## 📜 Security Hall of Fame

We appreciate security researchers who help make Recollect safer. With permission, we'll acknowledge your contribution in our security hall of fame.

## 📋 Security Checklist

### For Contributors
- [ ] Security implications considered
- [ ] Input validation implemented
- [ ] No hardcoded secrets
- [ ] Dependencies reviewed
- [ ] Tests include security scenarios

### For Deployers
- [ ] Latest version deployed
- [ ] Firewall configured
- [ ] HTTPS enabled
- [ ] Regular backups
- [ ] Monitoring enabled

### For Users
- [ ] Strong passwords used
- [ ] Regular updates applied
- [ ] Security advisories monitored
- [ ] Secure deployment followed

---

*This security policy is reviewed and updated regularly. Last updated: April 2026*</content>
<parameter name="filePath">/home/deltauser/Desktop/code/web/Recollect/SECURITY.md