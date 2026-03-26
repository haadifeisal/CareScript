import React, { useMemo } from "react";
import { Card, Row, Col, Button, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";

const STORAGE_KEY = "ehrNotes";

const DashboardHome: React.FC = () => {
  const notesCount = useMemo(() => {
    try {
      const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      return Array.isArray(raw) ? raw.length : 0;
    } catch {
      return 0;
    }
  }, []);

  return (
    <>
      <Row className="g-3">
        <Col lg={8}>
          <Card className="border-0 shadow-sm" style={{ borderRadius: 18 }}>
            <Card.Body className="p-4 p-md-5">
              <div className="d-flex align-items-center gap-2 mb-2">
                <Badge bg="light" text="dark" className="border">
                  Doctor–patient workflow
                </Badge>
                <Badge bg="light" text="dark" className="border">
                  Audio → EHR
                </Badge>
              </div>

              <h2 className="fw-bold mb-2" style={{ lineHeight: 1.1 }}>
                Create clean clinical notes—fast.
              </h2>
              <div className="text-muted" style={{ maxWidth: 620, lineHeight: 1.7 }}>
                Start by adding patient details, then record the encounter. MediScriber transcribes and turns it into a structured note ready for review and export.
              </div>

              <div className="d-flex gap-2 mt-4 flex-wrap">
                <Button as={Link} to="/dashboard/create" variant="success" size="lg" style={{ borderRadius: 12, paddingInline: 18 }}>
                  Create new note
                </Button>
                <Button as={Link} to="/dashboard/notes" variant="outline-primary" size="lg" style={{ borderRadius: 12, paddingInline: 18 }}>
                  View previous notes
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className="border-0 shadow-sm h-100" style={{ borderRadius: 18 }}>
            <Card.Body className="p-4">
              <div className="text-muted mb-1">Saved notes</div>
              <div className="fw-bold" style={{ fontSize: 34 }}>{notesCount}</div>
              <div className="text-muted mt-2" style={{ lineHeight: 1.6 }}>
                Your generated EHR notes are stored locally and available under “Previous Notes”.
              </div>

              <div className="mt-3 p-3 rounded-4" style={{ background: "rgba(13,110,253,0.06)", border: "1px solid rgba(13,110,253,0.14)" }}>
                <div className="fw-semibold mb-1">Tip</div>
                <div className="text-muted small" style={{ lineHeight: 1.6 }}>
                  Keep recordings concise (one visit at a time) for best note quality.
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-3 mt-1">
        {[
          { title: "Record the encounter", desc: "Capture history, symptoms, and clinician questions in one flow.", icon: "🎙️" },
          { title: "Transcribe with context", desc: "Clear text with punctuation and clinical phrasing support.", icon: "🧠" },
          { title: "Generate structured note", desc: "Assessment + Plan formatted in an EHR-ready template.", icon: "🧾" },
        ].map((f) => (
          <Col md={4} key={f.title}>
            <Card className="border-0 shadow-sm h-100" style={{ borderRadius: 18 }}>
              <Card.Body className="p-4">
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 14,
                    display: "grid",
                    placeItems: "center",
                    background: "rgba(13,110,253,0.10)",
                    border: "1px solid rgba(13,110,253,0.18)",
                    fontSize: 18,
                    marginBottom: 10,
                  }}
                >
                  {f.icon}
                </div>
                <div className="fw-bold">{f.title}</div>
                <div className="text-muted mt-2">{f.desc}</div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
};

export default DashboardHome;
