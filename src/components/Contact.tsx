import { FormEvent, useMemo, useState } from "react";
import { MdArrowOutward, MdCopyright } from "react-icons/md";
import "./styles/Contact.css";

type Status = "idle" | "submitting" | "success" | "error";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const isValid = useMemo(() => {
    const emailOk = /\S+@\S+\.\S+/.test(email);
    return name.trim().length > 1 && emailOk && message.trim().length > 4;
  }, [name, email, message]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isValid || status === "submitting") return;
    setStatus("submitting");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Failed to send. Please try again.");
      }
      setStatus("success");
      setName("");
      setEmail("");
      setMessage("");
    } catch (err: any) {
      setStatus("error");
      setError(err?.message || "Something went wrong.");
    }
  };

  return (
    <div className="contact-section section-container" id="contact">
      <div className="contact-container">
        <h3>Contact</h3>

        <div className="contact-grid">
          <form className="contact-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                name="name"
                placeholder="Your name"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="form-row">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-row">
              <label htmlFor="message">Project / Message</label>
              <textarea
                id="message"
                name="message"
                rows={4}
                placeholder="Tell me about your project, timeline, and goals."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="contact-submit"
              disabled={!isValid || status === "submitting" || status === "success"}
              data-cursor="disable"
            >
              {status === "submitting"
                ? "Sending..."
                : status === "success"
                ? "Sent!"
                : "Send Message"}
            </button>
            {status === "error" && <p className="form-status error">{error}</p>}
            {status === "success" && (
              <p className="form-status success">
                Thanks! I’ll get back to you soon.
              </p>
            )}
          </form>

          <div className="contact-meta">
            <div className="contact-box">
              <h4>Email</h4>
              <p>
                <a href="mailto:farabhussain4@gmail.com" data-cursor="disable">
                  farabhussain4@gmail.com
                </a>
              </p>
            </div>
            <div className="contact-box">
              <h4>Social</h4>
              <a
                href="https://github.com/Farab-Hussain"
                target="_blank"
                data-cursor="disable"
                className="contact-social"
              >
                Github <MdArrowOutward />
              </a>
              <a
                href="https://www.linkedin.com/in/farab-h-a29072287?utm_source=share_via&utm_content=profile&utm_medium=member_android"
                target="_blank"
                data-cursor="disable"
                className="contact-social"
              >
                Linkedin <MdArrowOutward />
              </a>
            </div>
            <div className="contact-box credit-box">
              <h2>
                Designed and Developed <br /> by <span>Farab Hussain</span>
              </h2>
              <h5>
                <MdCopyright /> 2026
              </h5>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
