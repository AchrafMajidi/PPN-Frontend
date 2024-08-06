"use client"
import React, { useEffect, useState } from 'react';
import Sidebar from "@/components/Sidebar";
import NavigationHeader from "@/components/NavigationHeader";
import Image from "next/image";
import "@/assets/css/links.css";
import "@/assets/css/center.module.css";
import "@/assets/css/hist.css";
import {
  teeth,
  consultation,
  eye
} from "@/components/imagepath";
import { useRouter } from 'next/navigation';
import { handleGenerateDocument } from "../page";

const Historique = ({ params }) => {
  const [consultations, setConsultations] = useState([]);
  const [selectedConsultation, setSelectedConsultation] = useState(null);

  const router = useRouter();
  const { id } = params;

  useEffect(() => {
    const fetchConsultations = async () => {
      try {
        const response = await fetch(`http://localhost:8080/jeunes/${id}`);
        const data = await response.json();
        setConsultations(data.dossierMedial.historiqueConsultations);
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
      }
    };

    fetchConsultations();
  }, [id]);

  const handleModify = () => {
    router.push("Consultation/modifier");
  };

  return (
    <div id="root">
      <Sidebar activeClassName="patients" />
      <div className="page-wrapper">
        <div className="content">
          <NavigationHeader pages={["Patients", id, "Historique"]} currentPage="Historique" />

          <div className="row hist-row">
            <div className="col-md-12 hist-card">
              <div className="card">
                <div className="card-body">
                  <ul className="timeline">
                    {consultations.map(consultation => (
                      <li key={consultation.id} className={consultation.id % 2 === 0 ? "timeline-inverted" : ""}>
                        <button className="timeline-badge activity-boxs comman-flex-center"
                          data-bs-toggle="modal"
                          data-bs-target="#con-close-modal">
                          <Image
                            src={consultation.motif.includes("Bucco-dentaire") ? teeth : eye} // Remplacez selon vos besoins
                            style={{ width: "50%", height: "50%" }}
                            height={50}
                            alt="#"
                          />
                        </button>

                        <button className="timeline-panel"
                          data-bs-toggle="modal"
                          data-bs-target="#con-close-modal"
                          onClick={() => setSelectedConsultation(consultation)}>
                          <div className="timeline-heading">
                            <h5 className="">Date : {consultation.date}</h5>
                          </div>
                          <div className="timeline-body">
                            <p>Motif : {consultation.motif}</p>
                            <p>Conseils : {consultation.conseils}</p>
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
        <div
  id="con-close-modal"
  className="modal fade"
  tabindex="-1"
  role="dialog"
  aria-hidden="true"
  style={{ display: "none" }}
>
  <div className="modal-dialog">
    <div className="modal-content">
      {selectedConsultation && (
        <>
          <div className="modal-header p-4">
            <Image
              src={consultation}
              alt="#"
              style={{ width: "7%", height: "7%" }}
            />
            <h4 className="modal-title">
              Consultation du {selectedConsultation.date}
            </h4>
            <button
              type="button"
              className="btn-close"
              data-bs-dismiss="modal"
              aria-label="Close"
            ></button>
          </div>
          <div className="modal-body p-4">
            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="motif" className="form-label">Motif</label>
                  <input
                    readOnly
                    value={selectedConsultation.motif}
                    type="text"
                    className="form-control"
                    id="motif"
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="ant" className="form-label">Antecedant Personnel</label>
                  <input
                    readOnly
                    value={`${selectedConsultation.antecedentPersonnel?.type || ''} -  ${ selectedConsultation.antecedentPersonnel?.specification || ''}`}
                    type="text"
                    className="form-control"
                    id="ant"
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="ant" className="form-label">Antecedant Familial</label>
                  <input
                    readOnly
                    value={`${selectedConsultation.antecedentFamilial?.typeAntFam || ''} - ${selectedConsultation.antecedentFamilial?.autre || ''}`}
                    type="text"
                    className="form-control"
                    id="ant"
                  />
                </div>
              </div>
            </div>
            <div className="row one-input">
              <div className="col-md-12">
                <div className="mb-3">
                  <label htmlFor="field-historique" className="form-label">
                    Interrogatoire
                  </label>
                  <textarea
                    className="form-control"
                    id="field-historique"
                    defaultValue={selectedConsultation.interrogatoire}
                  ></textarea>
                </div>
              </div>
            </div>
            
            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="examen-medicaux" className="form-label">
                    Examen Medical Biologique
                  </label>
                  <input
                    readOnly
                    value={
                      selectedConsultation.examenMedicals?.[0]
                        ? `${selectedConsultation.examenMedicals[0].specificationExamen} - ${selectedConsultation.examenMedicals[0].autreSpecification}`
                        : ''
                    }
                    type="text"
                    className="form-control"
                    id="examen-medicaux"
                  />
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <label htmlFor="diagnostic-positif" className="form-label">
                    Examen Médical Radiologique
                  </label>
                  <input
                    readOnly
                    value={
                      selectedConsultation.examenMedicals?.[1]
                        ? `${selectedConsultation.examenMedicals[1].specificationExamen} - ${selectedConsultation.examenMedicals[1].autreSpecification}`
                        : ''
                    }
                    type="text"
                    className="form-control"
                    id="diagnostic-positif"
                  />
                </div>
              </div>
            </div>
            <div className="row one-input">
              <div className="col-md-12">
                <div className="mb-3">
                  <label htmlFor="field-ordonnance" className="form-label">
                    Conseils
                  </label>
                  <textarea
                    className="form-control"
                    id="field-ordonnance"
                    defaultValue={selectedConsultation.conseils}
                  ></textarea>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary waves-effect btn-imprimer"
              data-bs-dismiss="modal"
              onClick={handleGenerateDocument}
            >
              Imprimer
            </button>
            <button
              type="button"
              className="btn btn-info btn-modifier"
              data-bs-dismiss="modal"
              onClick={handleModify}
            >
              Modifier
            </button>
          </div>
        </>
      )}
    </div>
  </div>
</div>

      
    </div>
  );
};

export default Historique;