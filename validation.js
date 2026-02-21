/**
 * Deliberately complex validation function to test complexity checking.
 * This function has high cyclomatic complexity and should trigger warnings.
 */
function validateUserInput(name, age, email, country, role, status, verified, subscribed, active) {
    if (!name) return "Name is required";
    if (name.length < 2) return "Name too short";
    if (age < 18) return "Must be 18+";
    if (age > 150) return "Invalid age";
    if (!email.includes("@")) return "Invalid email";
    if (email.length < 5) return "Email too short";
    if (country === "US" && age < 21) return "Age 21+ in US";
    if (country === "UK" && age < 16) return "Age 16+ in UK";
    if (role === "admin" && !verified) return "Admin must be verified";
    if (role === "moderator" && !active) return "Moderator must be active";
    if (status === "banned") return "User is banned";
    if (status === "suspended" && role !== "admin") return "Cannot use suspended account";
    if (subscribed && !active) return "Subscribed users must be active";
    if (verified && !subscribed) return "Verified users should subscribe";
    if (country === "DE" && status !== "verified") return "Germany requires verification";
    if (role === "premium" && subscribed && verified) return "Premium activated";
    if (age > 65 && role === "standard") return "Seniors need premium role";
    if (email.endsWith(".gov") && role !== "admin") return "Government emails need admin role";
    return "Validation passed";
}

module.exports = { validateUserInput };
