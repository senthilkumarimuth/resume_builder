import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';
import type { ResumeData } from '../types/resume';

// Create styles for PDF
const styles = StyleSheet.create({
  page: {
    padding: 40,
    fontSize: 11,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
    borderBottom: '2pt solid #2563eb',
    paddingBottom: 10,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#111827',
  },
  contactInfo: {
    fontSize: 9,
    color: '#4b5563',
    marginTop: 3,
  },
  section: {
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2563eb',
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  jobTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#111827',
  },
  company: {
    fontSize: 11,
    color: '#374151',
    marginTop: 2,
  },
  date: {
    fontSize: 9,
    color: '#6b7280',
    marginTop: 2,
  },
  description: {
    fontSize: 10,
    color: '#4b5563',
    marginTop: 4,
    lineHeight: 1.4,
  },
  bullet: {
    fontSize: 10,
    color: '#4b5563',
    marginTop: 3,
    paddingLeft: 10,
  },
  skillCategory: {
    fontSize: 10,
    marginTop: 5,
  },
  skillCategoryName: {
    fontWeight: 'bold',
    color: '#111827',
  },
  skillsList: {
    color: '#4b5563',
  },
});

const formatDate = (date: string) => {
  if (!date) return '';
  const d = new Date(date + '-01');
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

// PDF Document Component
const ResumePDF = ({ data }: { data: ResumeData }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.name}>{data.personalInfo.fullName || 'Your Name'}</Text>
        <Text style={styles.contactInfo}>
          {[
            data.personalInfo.email,
            data.personalInfo.phone,
            data.personalInfo.location,
          ]
            .filter(Boolean)
            .join(' • ')}
        </Text>
        {(data.personalInfo.linkedin || data.personalInfo.github || data.personalInfo.website) && (
          <Text style={styles.contactInfo}>
            {[
              data.personalInfo.linkedin && `LinkedIn: ${data.personalInfo.linkedin}`,
              data.personalInfo.github && `GitHub: ${data.personalInfo.github}`,
              data.personalInfo.website && `Website: ${data.personalInfo.website}`,
            ]
              .filter(Boolean)
              .join(' • ')}
          </Text>
        )}
      </View>

      {/* Summary */}
      {data.sectionVisibility.summary && data.summary && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Professional Summary</Text>
          <Text style={styles.description}>{data.summary}</Text>
        </View>
      )}

      {/* Skills */}
      {data.sectionVisibility.skills && data.skills.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Skills</Text>
          {Object.entries(
            data.skills.reduce((acc, skill) => {
              if (!acc[skill.category]) acc[skill.category] = [];
              acc[skill.category].push(skill.name);
              return acc;
            }, {} as Record<string, string[]>)
          ).map(([category, skills]) => (
            <View key={category} style={styles.skillCategory}>
              <Text>
                <Text style={styles.skillCategoryName}>{category}: </Text>
                <Text style={styles.skillsList}>{skills.join(', ')}</Text>
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Work Experience */}
      {data.sectionVisibility.workExperience && data.workExperience.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Work Experience</Text>
          {data.workExperience.map((exp, index) => (
            <View key={exp.id} style={{ marginTop: index > 0 ? 10 : 0 }}>
              <Text style={styles.jobTitle}>{exp.role}</Text>
              <Text style={styles.company}>{exp.company}</Text>
              <Text style={styles.date}>
                {formatDate(exp.startDate)} - {exp.current ? 'Present' : formatDate(exp.endDate)}
              </Text>
              {exp.description && (
                <Text style={styles.description}>{exp.description}</Text>
              )}
              {exp.projects.filter((p) => p.trim()).length > 0 &&
                exp.projects
                  .filter((p) => p.trim())
                  .map((project, idx) => (
                    <Text key={idx} style={styles.bullet}>
                      • {project}
                    </Text>
                  ))}
            </View>
          ))}
        </View>
      )}

      {/* Education */}
      {data.sectionVisibility.education && data.education.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Education</Text>
          {data.education.map((edu, index) => (
            <View key={edu.id} style={{ marginTop: index > 0 ? 10 : 0 }}>
              <Text style={styles.jobTitle}>
                {edu.degree} in {edu.field}
              </Text>
              <Text style={styles.company}>{edu.institution}</Text>
              <Text style={styles.date}>
                {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                {edu.gpa && ` | GPA: ${edu.gpa}`}
              </Text>
            </View>
          ))}
        </View>
      )}

      {/* Personal Details */}
      {data.sectionVisibility.personalDetails &&
        (data.personalDetails.fatherName ||
          data.personalDetails.dateOfBirth ||
          data.personalDetails.gender ||
          data.personalDetails.maritalStatus ||
          data.personalDetails.languagesKnown ||
          data.personalDetails.nationality) && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Details</Text>
          {data.personalDetails.fatherName && (
            <View style={styles.skillCategory}>
              <Text>
                <Text style={styles.skillCategoryName}>Father's Name: </Text>
                <Text style={styles.skillsList}>{data.personalDetails.fatherName}</Text>
              </Text>
            </View>
          )}
          {data.personalDetails.dateOfBirth && (
            <View style={styles.skillCategory}>
              <Text>
                <Text style={styles.skillCategoryName}>Date of Birth: </Text>
                <Text style={styles.skillsList}>
                  {new Date(data.personalDetails.dateOfBirth).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </Text>
              </Text>
            </View>
          )}
          {data.personalDetails.gender && (
            <View style={styles.skillCategory}>
              <Text>
                <Text style={styles.skillCategoryName}>Gender: </Text>
                <Text style={styles.skillsList}>{data.personalDetails.gender}</Text>
              </Text>
            </View>
          )}
          {data.personalDetails.maritalStatus && (
            <View style={styles.skillCategory}>
              <Text>
                <Text style={styles.skillCategoryName}>Marital Status: </Text>
                <Text style={styles.skillsList}>{data.personalDetails.maritalStatus}</Text>
              </Text>
            </View>
          )}
          {data.personalDetails.languagesKnown && (
            <View style={styles.skillCategory}>
              <Text>
                <Text style={styles.skillCategoryName}>Languages: </Text>
                <Text style={styles.skillsList}>{data.personalDetails.languagesKnown}</Text>
              </Text>
            </View>
          )}
          {data.personalDetails.nationality && (
            <View style={styles.skillCategory}>
              <Text>
                <Text style={styles.skillCategoryName}>Nationality: </Text>
                <Text style={styles.skillsList}>{data.personalDetails.nationality}</Text>
              </Text>
            </View>
          )}
        </View>
      )}
    </Page>
  </Document>
);

export const generatePDF = async (data: ResumeData) => {
  const blob = await pdf(<ResumePDF data={data} />).toBlob();
  return blob;
};

export const downloadPDF = async (data: ResumeData, filename: string = 'resume.pdf') => {
  const blob = await generatePDF(data);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
