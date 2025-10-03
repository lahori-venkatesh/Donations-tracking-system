// NGO Verification Service
class VerificationService {
  constructor() {
    this.verificationLevels = {
      BASIC: 'basic',
      VERIFIED: 'verified',
      PREMIUM: 'premium',
      SUSPENDED: 'suspended'
    };

    this.verificationCriteria = {
      documents: [
        'ngo_registration_certificate',
        'pan_card',
        'tan_certificate',
        '12a_certificate',
        '80g_certificate',
        'fcra_certificate'
      ],
      compliance: [
        'annual_returns_filed',
        'audit_reports_submitted',
        'transparency_score',
        'project_completion_rate'
      ]
    };
  }

  // Simulate NGO verification check
  async verifyNGO(ngoId, documents = {}) {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const verificationResult = {
        ngoId,
        verificationLevel: this.calculateVerificationLevel(documents),
        verifiedDate: new Date().toISOString(),
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year
        documents: this.validateDocuments(documents),
        complianceScore: this.calculateComplianceScore(documents),
        fraudRiskScore: this.calculateFraudRisk(documents),
        verificationBadges: this.generateVerificationBadges(documents),
        nextReviewDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString() // 3 months
      };

      return {
        success: true,
        data: verificationResult
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  calculateVerificationLevel(documents) {
    const requiredDocs = ['ngo_registration_certificate', 'pan_card'];
    const premiumDocs = ['12a_certificate', '80g_certificate', 'audit_reports'];
    
    const hasRequired = requiredDocs.every(doc => documents[doc]?.verified);
    const hasPremium = premiumDocs.some(doc => documents[doc]?.verified);
    
    if (!hasRequired) return this.verificationLevels.BASIC;
    if (hasPremium && documents.compliance_score >= 80) return this.verificationLevels.PREMIUM;
    if (hasRequired) return this.verificationLevels.VERIFIED;
    
    return this.verificationLevels.BASIC;
  }

  validateDocuments(documents) {
    const validatedDocs = {};
    
    this.verificationCriteria.documents.forEach(docType => {
      if (documents[docType]) {
        validatedDocs[docType] = {
          ...documents[docType],
          verified: this.simulateDocumentVerification(docType, documents[docType]),
          verifiedDate: new Date().toISOString()
        };
      }
    });

    return validatedDocs;
  }

  simulateDocumentVerification(docType, document) {
    // Simulate document verification logic
    const verificationRules = {
      ngo_registration_certificate: document.registrationNumber?.length >= 10,
      pan_card: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(document.panNumber),
      '12a_certificate': document.certificateNumber?.startsWith('12A'),
      '80g_certificate': document.certificateNumber?.includes('80G'),
      audit_reports: document.auditYear >= new Date().getFullYear() - 2
    };

    return verificationRules[docType] || false;
  }

  calculateComplianceScore(documents) {
    let score = 0;
    const maxScore = 100;

    // Document completeness (40 points)
    const docScore = (Object.keys(documents).length / this.verificationCriteria.documents.length) * 40;
    score += docScore;

    // Verification status (30 points)
    const verifiedDocs = Object.values(documents).filter(doc => doc.verified).length;
    const verificationScore = (verifiedDocs / Object.keys(documents).length) * 30;
    score += verificationScore;

    // Additional compliance factors (30 points)
    if (documents.annual_returns_filed) score += 10;
    if (documents.audit_reports_submitted) score += 10;
    if (documents.transparency_score >= 80) score += 10;

    return Math.min(Math.round(score), maxScore);
  }

  calculateFraudRisk(documents) {
    let riskScore = 0;

    // Missing critical documents increases risk
    if (!documents.ngo_registration_certificate?.verified) riskScore += 30;
    if (!documents.pan_card?.verified) riskScore += 25;
    if (!documents.audit_reports) riskScore += 20;

    // Inconsistent information increases risk
    if (documents.inconsistency_flags?.length > 0) {
      riskScore += documents.inconsistency_flags.length * 5;
    }

    // Recent complaints or issues
    if (documents.complaint_history?.length > 0) {
      riskScore += documents.complaint_history.length * 10;
    }

    return Math.min(riskScore, 100);
  }

  generateVerificationBadges(documents) {
    const badges = [];

    if (documents.ngo_registration_certificate?.verified) {
      badges.push({
        type: 'registered',
        label: 'Registered NGO',
        icon: 'shield-check',
        color: 'green'
      });
    }

    if (documents['80g_certificate']?.verified) {
      badges.push({
        type: '80g_certified',
        label: '80G Certified',
        icon: 'certificate',
        color: 'blue'
      });
    }

    if (documents['12a_certificate']?.verified) {
      badges.push({
        type: '12a_certified',
        label: '12A Certified',
        icon: 'award',
        color: 'purple'
      });
    }

    if (documents.fcra_certificate?.verified) {
      badges.push({
        type: 'fcra_approved',
        label: 'FCRA Approved',
        icon: 'globe',
        color: 'indigo'
      });
    }

    if (documents.audit_reports?.verified && documents.transparency_score >= 90) {
      badges.push({
        type: 'transparency_champion',
        label: 'Transparency Champion',
        icon: 'eye',
        color: 'yellow'
      });
    }

    return badges;
  }

  // Fraud detection alerts
  generateFraudAlerts(ngoId, activities) {
    const alerts = [];

    // Check for suspicious patterns
    const recentDonations = activities.filter(a => 
      a.type === 'donation_received' && 
      new Date(a.date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    );

    const recentUpdates = activities.filter(a => 
      a.type === 'project_update' && 
      new Date(a.date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    );

    // Alert: High donations but no updates
    if (recentDonations.length > 5 && recentUpdates.length === 0) {
      alerts.push({
        type: 'no_updates',
        severity: 'high',
        message: 'NGO received significant donations but posted no project updates',
        action: 'Request immediate project update'
      });
    }

    // Alert: Inconsistent financial reporting
    const totalReceived = recentDonations.reduce((sum, d) => sum + d.amount, 0);
    const reportedSpent = recentUpdates.reduce((sum, u) => sum + (u.amountSpent || 0), 0);
    
    if (totalReceived > 0 && reportedSpent > totalReceived * 1.1) {
      alerts.push({
        type: 'financial_mismatch',
        severity: 'critical',
        message: 'Reported spending exceeds received donations',
        action: 'Immediate financial audit required'
      });
    }

    return alerts;
  }

  // Generate unique receipt numbers
  generateReceiptNumber(ngoId, donationId) {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `RCP-${ngoId}-${donationId}-${timestamp}-${random}`;
  }

  // Blockchain-like audit trail (simplified)
  createAuditTrail(action, data, previousHash = null) {
    const timestamp = Date.now();
    const actionData = JSON.stringify({ action, data, timestamp });
    
    // Simple hash simulation (in real implementation, use proper cryptographic hash)
    const hash = btoa(actionData + (previousHash || '')).substring(0, 16);
    
    return {
      timestamp,
      action,
      data,
      hash,
      previousHash,
      immutable: true
    };
  }
}

export default new VerificationService();