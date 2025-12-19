import {
  Document,
  Paragraph,
  TextRun,
  AlignmentType,
  HeadingLevel,
  convertInchesToTwip,
  BorderStyle,
  Packer,
} from 'docx';
import type { ResumeData } from '../types/resume';

const formatDate = (date: string) => {
  if (!date) return '';
  const d = new Date(date + '-01');
  return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
};

export const generateDOCX = async (data: ResumeData): Promise<Blob> => {
  const sections: Paragraph[] = [];

  // Header - Name
  sections.push(
    new Paragraph({
      text: data.personalInfo.fullName || 'Your Name',
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
      spacing: {
        after: 100,
      },
    })
  );

  // Contact Information
  const contactParts: string[] = [];
  if (data.personalInfo.email) contactParts.push(data.personalInfo.email);
  if (data.personalInfo.phone) contactParts.push(data.personalInfo.phone);
  if (data.personalInfo.location) contactParts.push(data.personalInfo.location);

  if (contactParts.length > 0) {
    sections.push(
      new Paragraph({
        text: contactParts.join('  •  '),
        alignment: AlignmentType.CENTER,
        spacing: {
          after: 50,
        },
      })
    );
  }

  // Social Links
  const socialParts: string[] = [];
  if (data.personalInfo.linkedin) socialParts.push(data.personalInfo.linkedin);
  if (data.personalInfo.github) socialParts.push(data.personalInfo.github);
  if (data.personalInfo.website) socialParts.push(data.personalInfo.website);

  if (socialParts.length > 0) {
    sections.push(
      new Paragraph({
        text: socialParts.join('  •  '),
        alignment: AlignmentType.CENTER,
        spacing: {
          after: 200,
        },
      })
    );
  }

  // Professional Summary
  if (data.sectionVisibility.summary && data.summary) {
    sections.push(
      new Paragraph({
        text: 'PROFESSIONAL SUMMARY',
        heading: HeadingLevel.HEADING_2,
        spacing: {
          before: 200,
          after: 100,
        },
        border: {
          bottom: {
            color: '2563eb',
            space: 1,
            style: BorderStyle.SINGLE,
            size: 6,
          },
        },
      })
    );

    sections.push(
      new Paragraph({
        text: data.summary,
        spacing: {
          after: 200,
        },
      })
    );
  }

  // Skills
  if (data.sectionVisibility.skills && data.skills.length > 0) {
    sections.push(
      new Paragraph({
        text: 'SKILLS',
        heading: HeadingLevel.HEADING_2,
        spacing: {
          before: 200,
          after: 100,
        },
        border: {
          bottom: {
            color: '2563eb',
            space: 1,
            style: BorderStyle.SINGLE,
            size: 6,
          },
        },
      })
    );

    // Group skills by category
    const skillsByCategory = data.skills.reduce((acc, skill) => {
      if (!acc[skill.category]) acc[skill.category] = [];
      acc[skill.category].push(skill.name);
      return acc;
    }, {} as Record<string, string[]>);

    Object.entries(skillsByCategory).forEach(([category, skills]) => {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${category}: `,
              bold: true,
            }),
            new TextRun({
              text: skills.join(', '),
            }),
          ],
          spacing: {
            after: 100,
          },
        })
      );
    });

    sections.push(
      new Paragraph({
        text: '',
        spacing: {
          after: 100,
        },
      })
    );
  }

  // Work Experience
  if (data.sectionVisibility.workExperience && data.workExperience.length > 0) {
    sections.push(
      new Paragraph({
        text: 'WORK EXPERIENCE',
        heading: HeadingLevel.HEADING_2,
        spacing: {
          before: 200,
          after: 100,
        },
        border: {
          bottom: {
            color: '2563eb',
            space: 1,
            style: BorderStyle.SINGLE,
            size: 6,
          },
        },
      })
    );

    data.workExperience.forEach((exp, index) => {
      // Job title
      sections.push(
        new Paragraph({
          text: exp.role,
          heading: HeadingLevel.HEADING_3,
          spacing: {
            before: index > 0 ? 200 : 0,
            after: 50,
          },
        })
      );

      // Company
      sections.push(
        new Paragraph({
          text: exp.company,
          spacing: {
            after: 50,
          },
        })
      );

      // Duration
      sections.push(
        new Paragraph({
          text: `${formatDate(exp.startDate)} - ${exp.current ? 'Present' : formatDate(exp.endDate)}`,
          italics: true,
          spacing: {
            after: 100,
          },
        })
      );

      // Description
      if (exp.description) {
        sections.push(
          new Paragraph({
            text: exp.description,
            spacing: {
              after: 100,
            },
          })
        );
      }

      // Projects/Responsibilities
      exp.projects
        .filter((p) => p.trim())
        .forEach((project) => {
          sections.push(
            new Paragraph({
              text: project,
              bullet: {
                level: 0,
              },
              spacing: {
                after: 50,
              },
            })
          );
        });
    });

    sections.push(
      new Paragraph({
        text: '',
        spacing: {
          after: 100,
        },
      })
    );
  }

  // Education
  if (data.sectionVisibility.education && data.education.length > 0) {
    sections.push(
      new Paragraph({
        text: 'EDUCATION',
        heading: HeadingLevel.HEADING_2,
        spacing: {
          before: 200,
          after: 100,
        },
        border: {
          bottom: {
            color: '2563eb',
            space: 1,
            style: BorderStyle.SINGLE,
            size: 6,
          },
        },
      })
    );

    data.education.forEach((edu, index) => {
      // Degree
      sections.push(
        new Paragraph({
          text: `${edu.degree} in ${edu.field}`,
          heading: HeadingLevel.HEADING_3,
          spacing: {
            before: index > 0 ? 200 : 0,
            after: 50,
          },
        })
      );

      // Institution
      sections.push(
        new Paragraph({
          text: edu.institution,
          spacing: {
            after: 50,
          },
        })
      );

      // Duration and GPA
      const eduDetails = `${formatDate(edu.startDate)} - ${formatDate(edu.endDate)}${
        edu.gpa ? ` | GPA: ${edu.gpa}` : ''
      }`;
      sections.push(
        new Paragraph({
          text: eduDetails,
          italics: true,
          spacing: {
            after: 100,
          },
        })
      );
    });

    sections.push(
      new Paragraph({
        text: '',
        spacing: {
          after: 100,
        },
      })
    );
  }

  // Personal Details
  if (
    data.sectionVisibility.personalDetails &&
    (data.personalDetails.fatherName ||
      data.personalDetails.dateOfBirth ||
      data.personalDetails.gender ||
      data.personalDetails.maritalStatus ||
      data.personalDetails.languagesKnown ||
      data.personalDetails.nationality)
  ) {
    sections.push(
      new Paragraph({
        text: 'PERSONAL DETAILS',
        heading: HeadingLevel.HEADING_2,
        spacing: {
          before: 200,
          after: 100,
        },
        border: {
          bottom: {
            color: '2563eb',
            space: 1,
            style: BorderStyle.SINGLE,
            size: 6,
          },
        },
      })
    );

    if (data.personalDetails.fatherName) {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: "Father's Name: ",
              bold: true,
            }),
            new TextRun({
              text: data.personalDetails.fatherName,
            }),
          ],
          spacing: {
            after: 100,
          },
        })
      );
    }

    if (data.personalDetails.dateOfBirth) {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: 'Date of Birth: ',
              bold: true,
            }),
            new TextRun({
              text: new Date(data.personalDetails.dateOfBirth).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              }),
            }),
          ],
          spacing: {
            after: 100,
          },
        })
      );
    }

    if (data.personalDetails.gender) {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: 'Gender: ',
              bold: true,
            }),
            new TextRun({
              text: data.personalDetails.gender,
            }),
          ],
          spacing: {
            after: 100,
          },
        })
      );
    }

    if (data.personalDetails.maritalStatus) {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: 'Marital Status: ',
              bold: true,
            }),
            new TextRun({
              text: data.personalDetails.maritalStatus,
            }),
          ],
          spacing: {
            after: 100,
          },
        })
      );
    }

    if (data.personalDetails.languagesKnown) {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: 'Languages: ',
              bold: true,
            }),
            new TextRun({
              text: data.personalDetails.languagesKnown,
            }),
          ],
          spacing: {
            after: 100,
          },
        })
      );
    }

    if (data.personalDetails.nationality) {
      sections.push(
        new Paragraph({
          children: [
            new TextRun({
              text: 'Nationality: ',
              bold: true,
            }),
            new TextRun({
              text: data.personalDetails.nationality,
            }),
          ],
          spacing: {
            after: 100,
          },
        })
      );
    }
  }

  // Create the document
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(0.75),
              right: convertInchesToTwip(0.75),
              bottom: convertInchesToTwip(0.75),
              left: convertInchesToTwip(0.75),
            },
          },
        },
        children: sections,
      },
    ],
  });

  // Generate and return blob
  const blob = await Packer.toBlob(doc);
  return blob;
};

export const downloadDOCX = async (data: ResumeData, filename: string = 'resume.docx') => {
  const blob = await generateDOCX(data);
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
