import React, { useState, useEffect } from "react";
import reportService from "../../services/report.service";
import "./ReportsPage.css";
import "../../App.css";
import violationTypeService from "../../services/violationType.service";
import { EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import { Select, Popconfirm, Modal } from "antd";
import advertsService from "../../services/adverts.service";
import threadService from "../../services/thread.service";
import commentService from "../../services/comment.service";
import resourceService from "../../services/resource.service";
import AdvertReportModal from "./AdvertReportModal";
import ResourceReportModal from "./ResourceReportModal";
const { Option } = Select;

const ReportsPage = () => {
  const [reports, setReports] = useState([]);
  const navigate = useNavigate();
  const [violationTypes, setViolationTypes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const reportsPerPage = 10;
  const [filters, setFilters] = useState({
    violationTypeId: "",
    contentType: "",
  });
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedContent, setSelectedContent] = useState(null);
  const [advertModalVisible, setAdvertModalVisible] = useState(false);
  const [advertData, setAdvertData] = useState(null);
  const [resourceModalVisible, setResourceModalVisible] = useState(false);
  const [resourceData, setResourceData] = useState(null);
  useEffect(() => {
    const fetchViolationTypes = async () => {
      try {
        const response = await violationTypeService.getAllViolationTypes();
        setViolationTypes(response.data);
      } catch (err) {
        console.error("Failed to load violation types:", err);
      }
    };

    fetchViolationTypes();
  }, []);

  useEffect(() => {
    const fetchAllReports = async () => {
      const [threadReports, advertReports, commentReports, resourceReports] =
        await Promise.all([
          reportService.getAllThreadReportsWithDetails(),
          reportService.getAllAdvertReportsWithDetails(),
          reportService.getAllCommentReportsWithDetails(),
          reportService.getAllResourceReportsWithDetails(),
        ]);

      setReports([
        ...threadReports,
        ...advertReports,
        ...commentReports,
        ...resourceReports,
      ]);
    };

    fetchAllReports();
  }, []);

  const filteredReports = reports.filter(
    (r) =>
      (!filters.violationTypeId ||
        r.violationTypeId === +filters.violationTypeId) &&
      (!filters.contentType || r.contentType === filters.contentType)
  );

  const indexOfLastReport = currentPage * reportsPerPage;
  const indexOfFirstReport = indexOfLastReport - reportsPerPage;
  const currentReports = filteredReports.slice(
    indexOfFirstReport,
    indexOfLastReport
  );
  const totalPages = Math.ceil(filteredReports.length / reportsPerPage);

  const viewContent = async (report) => {
    switch (report.contentType) {
      case "thread":
        navigate(`/admin/discussion/thread/${report.contentId}`);
        break;

      case "advert":
        try {
          const response = await advertsService.getById(report.contentId);
          setAdvertData(response.data);
          setAdvertModalVisible(true);
        } catch (err) {
          console.error("Failed to load advert:", err);
        }
        break;

      case "comment":
        const comment = await commentService.getById(report.contentId);
        setSelectedReport(report);
        setSelectedContent(comment.data);
        break;

      case "resource":
        try {
          const response = await resourceService.getResourceById(
            report.contentId
          );
          setResourceData(response.data);
          setResourceModalVisible(true);
        } catch (err) {
          console.error("Failed to load resource:", err);
        }
        break;

      default:
        console.warn("Unknown content type:", report.contentType);
    }
  };

  const deleteContent = async (report) => {
    try {
      switch (report.contentType) {
        case "advert":
          try {
            await advertsService.deleteAdvert(report.contentId);
          } catch (err) {
            console.error("Error deleting advert:", err);
          }
          break;
        case "thread":
          try {
            await threadService.deleteDiscussionThread(report.contentId);
          } catch (err) {
            console.error("Error deleting thread:", err);
          }
          break;
        case "comment":
          try {
            await commentService.deleteComment(report.contentId);
          } catch (err) {
            console.error("Error deleting comment:", err);
          }
          break;
        case "resource":
          try {
            await resourceService.deleteResource(report.contentId);
          } catch (err) {
            console.error("Error deleting resource:", err);
          }
          break;
        default:
          alert("Unknown post.");
      }
      alert("Content deleted successfully");
      setReports(reports.filter((r) => r.id !== report.id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete content");
    }
  };

  const deleteReport = async (report) => {
    try {
      switch (report.contentType) {
        case "advert":
          try {
            await reportService.deleteAdvertReport(report.id);
            await reportService.deleteReport(report.id);
          } catch (err) {
            console.error("Error deleting advert:", err);
          }
          break;
        case "thread":
          try {
            await reportService.deleteThreadReport(report.id);
            await reportService.deleteReport(report.id);
          } catch (err) {
            console.error("Error deleting advert:", err);
          }
          break;
        case "comment":
          try {
            await reportService.deleteCommentReport(report.id);
            await reportService.deleteReport(report.id);
          } catch (err) {
            console.error("Error deleting advert:", err);
          }
          break;
        case "resource":
          try {
            await reportService.deleteResourceReport(report.id);
            await reportService.deleteReport(report.id);
          } catch (err) {
            console.error("Error deleting advert:", err);
          }
          break;
        default:
          alert("Unknown post.");
      }
      alert("Report deleted successfully");
      setReports(reports.filter((r) => r.id !== report.id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete report");
    }
  };

  const handleCloseResourceModal = () => {
    setResourceModalVisible(false);
  };

  const handleCloseAdvertModal = () => {
    setAdvertModalVisible(false);
  };

  return (
    <div className="reports-page">
      <h2>Reports</h2>

      <div className="filters">
        <Select
          value={filters.violationTypeId}
          onChange={(value) =>
            setFilters({ ...filters, violationTypeId: value })
          }
          placeholder="All types"
          className="custom-sort-select"
          allowClear
        >
          <Option value="">All types</Option>
          {violationTypes.map((v) => (
            <Option key={v.id} value={v.id}>
              {v.name}
            </Option>
          ))}
        </Select>

        <Select
          value={filters.contentType}
          onChange={(value) => setFilters({ ...filters, contentType: value })}
          placeholder="All"
          className="custom-sort-select"
          allowClear
        >
          <Option value="">All</Option>
          <Option value="advert">Advert</Option>
          <Option value="comment">Comment</Option>
          <Option value="resource">Resource</Option>
          <Option value="thread">Thread</Option>
        </Select>
      </div>

      <div className="reports-table-wrapper">
        <table className="reports-table">
          <thead>
            <tr>
              <th>Violation Type</th>
              <th>Description</th>
              <th>Timestamp</th>
              <th>Content Type</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentReports.map((r) => (
              <tr key={`${r.contentType}-${r.id}`}>
                <td>
                  {violationTypes.find((v) => v.id === r.violationTypeId)?.name}
                </td>
                <td>{r.description}</td>
                <td>{new Date(r.timestamp).toLocaleString()}</td>
                <td>{r.contentType}</td>
                <td>
                  <button
                    className="action-button-reports"
                    onClick={() => viewContent(r)}
                    title="View details"
                  >
                    <EyeOutlined style={{ color: "#020f3d" }} />
                  </button>

                  <Popconfirm
                    title="Are you sure you want to delete this content?"
                    onConfirm={() => deleteContent(r)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <button
                      className="action-button-reports"
                      title="Delete content"
                    >
                      <DeleteOutlined style={{ color: "orange" }} />
                    </button>
                  </Popconfirm>

                  <Popconfirm
                    title="Are you sure you want to delete this report?"
                    onConfirm={() => deleteReport(r)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <button
                      className="action-button-reports"
                      title="Delete report"
                    >
                      <DeleteOutlined style={{ color: "red" }} />
                    </button>
                  </Popconfirm>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="reports-cards">
        {currentReports.map((r) => (
          <div className="report-card" key={`card-${r.contentType}-${r.id}`}>
            <p>
              <strong>Violation:</strong>{" "}
              {violationTypes.find((v) => v.id === r.violationTypeId)?.name}
            </p>
            <p>
              <strong>Description:</strong> {r.description}
            </p>
            <p>
              <strong>Timestamp:</strong>{" "}
              {new Date(r.timestamp).toLocaleString()}
            </p>
            <p>
              <strong>Type:</strong> {r.contentType}
            </p>

            <div className="card-actions">
              <button
                className="action-button-reports"
                onClick={() => viewContent(r)}
                title="View details"
              >
                <EyeOutlined style={{ color: "#020f3d" }} />
              </button>

              <Popconfirm
                title="Are you sure you want to delete this content?"
                onConfirm={() => deleteContent(r)}
                okText="Yes"
                cancelText="No"
              >
                <button
                  className="action-button-reports"
                  title="Delete content"
                >
                  <DeleteOutlined style={{ color: "orange" }} />
                </button>
              </Popconfirm>

              <Popconfirm
                title="Are you sure you want to delete this report?"
                onConfirm={() => deleteReport(r)}
                okText="Yes"
                cancelText="No"
              >
                <button className="action-button-reports" title="Delete report">
                  <DeleteOutlined style={{ color: "red" }} />
                </button>
              </Popconfirm>
            </div>
          </div>
        ))}
      </div>
      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Back
          </button>
          <span>
            Page {currentPage} out of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}

      {selectedReport && selectedContent && (
        <Modal
          title="Content details"
          open={!!selectedReport}
          onCancel={() => {
            setSelectedReport(null);
            setSelectedContent(null);
          }}
          centered
          footer={[
            <button
              key="cancel"
              className="cancel-advert-button"
              onClick={() => {
                setSelectedReport(null);
                setSelectedContent(null);
              }}
            >
              Close
            </button>,
          ]}
        >
          {selectedReport.contentType === "comment" ? (
            <>
              <p>
                <strong>Content:</strong> {selectedContent.description}
              </p>
              <p>
                <Link to={`/admin/users/${selectedContent.userId}`}>
                  See author
                </Link>
              </p>
            </>
          ) : (
            <pre>{JSON.stringify(selectedContent, null, 2)}</pre>
          )}
        </Modal>
      )}

      {advertModalVisible && advertData && (
        <div className="modal">
          <div className="modal-content">
            <AdvertReportModal
              visible={advertModalVisible}
              advert={advertData}
              onCancel={handleCloseAdvertModal}
            />
            <button onClick={() => setAdvertModalVisible(false)}>Close</button>
          </div>
        </div>
      )}

      {resourceModalVisible && resourceData && (
        <div className="modal">
          <div className="modal-content">
            <ResourceReportModal
              visible={resourceModalVisible}
              resource={resourceData}
              onCancel={handleCloseResourceModal}
            />
            <button onClick={() => setResourceModalVisible(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;
