import {
  BookOpen,
  FileText,
  Users,
  CheckCircle,
  Phone,
  Upload,
  Shield,
  ArrowLeft,
  Eye,
  Link,
  Clock,
  AlertCircle,
  Send,
  UserCheck,
  UserCog,
  Activity,
  Lock,
  UserPlus
} from "lucide-react";
import { Card } from "@/components/ui/card";
import DashboardLayout from "@/components/admin/DashboardLayout";
import { useTranslation } from "react-i18next";

const Documentation = () => {
  const { t } = useTranslation();
  const workflowSteps = [
    {
      number: 1,
      title: t('docs.step1Title'),
      status: t('status.new'),
      icon: FileText,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      description: t('docs.step1Desc'),
      action: t('docs.step1Action')
    },
    {
      number: 2,
      title: t('docs.step2Title'),
      status: "pending_validation → validated",
      icon: Shield,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      description: t('docs.step2Desc'),
      action: t('docs.step2Action')
    },
    {
      number: 3,
      title: t('docs.step3Title'),
      status: "validated → call_confirmed",
      icon: Phone,
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      description: t('docs.step3Desc'),
      action: t('docs.step3Action')
    },
    {
      number: 4,
      title: t('docs.step4Title'),
      status: "call_confirmed → documents_requested",
      icon: Send,
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      description: t('docs.step4Desc'),
      action: t('docs.step4Action')
    },
    {
      number: 5,
      title: t('docs.step5Title'),
      status: "documents_requested → documents_uploaded",
      icon: Upload,
      color: "from-pink-500 to-pink-600",
      bgColor: "bg-pink-50",
      description: t('docs.step5Desc'),
      action: t('docs.step5Action')
    },
    {
      number: 6,
      title: t('docs.step6Title'),
      status: "documents_uploaded → documents_verified",
      icon: Eye,
      color: "from-indigo-500 to-indigo-600",
      bgColor: "bg-indigo-50",
      description: t('docs.step6Desc'),
      action: t('docs.step6Action')
    },
    {
      number: 7,
      title: t('docs.step7Title'),
      status: "documents_verified → converted_to_client",
      icon: UserCheck,
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50",
      description: t('docs.step7Desc'),
      action: t('docs.step7Action')
    }
  ];

  const features = [
    {
      icon: FileText,
      title: t('docs.feature1Title'),
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      items: [
        t('docs.feature1Item1'),
        t('docs.feature1Item2'),
        t('docs.feature1Item3'),
        t('docs.feature1Item4')
      ]
    },
    {
      icon: Users,
      title: t('docs.feature2Title'),
      color: "text-green-500",
      bgColor: "bg-green-50",
      items: [
        t('docs.feature2Item1'),
        t('docs.feature2Item2'),
        t('docs.feature2Item3'),
        t('docs.feature2Item4')
      ]
    },
    {
      icon: UserCog,
      title: t('docs.feature3Title'),
      color: "text-indigo-500",
      bgColor: "bg-indigo-50",
      items: [
        t('docs.feature3Item1'),
        t('docs.feature3Item2'),
        t('docs.feature3Item3'),
        t('docs.feature3Item4')
      ]
    },
    {
      icon: Upload,
      title: t('docs.feature4Title'),
      color: "text-purple-500",
      bgColor: "bg-purple-50",
      items: [
        t('docs.feature4Item1'),
        t('docs.feature4Item2'),
        t('docs.feature4Item3'),
        t('docs.feature4Item4')
      ]
    },
    {
      icon: Activity,
      title: t('docs.feature5Title'),
      color: "text-cyan-500",
      bgColor: "bg-cyan-50",
      items: [
        t('docs.feature5Item1'),
        t('docs.feature5Item2'),
        t('docs.feature5Item3'),
        t('docs.feature5Item4')
      ]
    },
    {
      icon: Shield,
      title: t('docs.feature6Title'),
      color: "text-orange-500",
      bgColor: "bg-orange-50",
      items: [
        t('docs.feature6Item1'),
        t('docs.feature6Item2'),
        t('docs.feature6Item3'),
        t('docs.feature6Item4')
      ]
    }
  ];

  const documentTypes = [
    { name: t('docTypes.passport'), key: "passport" },
    { name: t('docTypes.national_id'), key: "national_id" },
    { name: t('docTypes.birth_certificate'), key: "birth_certificate" },
    { name: t('docTypes.diploma'), key: "diploma" },
    { name: t('docTypes.work_contract'), key: "work_contract" },
    { name: t('docTypes.bank_statement'), key: "bank_statement" },
    { name: t('docTypes.proof_of_address'), key: "proof_of_address" },
    { name: t('docTypes.marriage_certificate'), key: "marriage_certificate" },
    { name: t('docTypes.police_clearance'), key: "police_clearance" },
    { name: t('docTypes.medical_report'), key: "medical_report" },
    { name: t('docTypes.other'), key: "other" }
  ];

  const bestPractices = [
    {
      icon: CheckCircle,
      title: t('docs.quickVerification'),
      description: t('docs.quickVerificationDesc')
    },
    {
      icon: Phone,
      title: t('docs.effectiveCommunication'),
      description: t('docs.effectiveCommunicationDesc')
    },
    {
      icon: Clock,
      title: t('docs.regularFollowUp'),
      description: t('docs.regularFollowUpDesc')
    },
    {
      icon: AlertCircle,
      title: t('docs.transparencyCommunication'),
      description: t('docs.transparencyCommunicationDesc')
    }
  ];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="animate-fade-in-up">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-br from-primary to-accent rounded-xl">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-foreground">{t('docs.title')}</h2>
              <p className="text-muted-foreground mt-1">
                {t('docs.subtitle')}
              </p>
            </div>
          </div>
        </div>

        {/* Platform Overview */}
        <Card className="p-8 bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
          <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary" />
            {t('docs.overviewTitle')}
          </h3>
          <p className="text-foreground leading-relaxed mb-4">
            <span className="font-bold text-primary">Connect Job World</span> {t('docs.overviewDescription')}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
            <div className="bg-white p-4 rounded-lg border border-blue-200">
              <div className="text-3xl font-bold text-primary mb-1">7</div>
              <div className="text-sm text-muted-foreground">{t('docs.workflowStages')}</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-blue-200">
              <div className="text-3xl font-bold text-green-600 mb-1">11</div>
              <div className="text-sm text-muted-foreground">{t('docs.documentTypes')}</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-blue-200">
              <div className="text-3xl font-bold text-purple-600 mb-1">6</div>
              <div className="text-sm text-muted-foreground">{t('docs.availableServices')}</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-blue-200">
              <div className="text-3xl font-bold text-indigo-600 mb-1">3</div>
              <div className="text-sm text-muted-foreground">{t('docs.userRoles')}</div>
            </div>
          </div>
        </Card>

        {/* Workflow Steps */}
        <div>
          <h3 className="text-2xl font-bold text-foreground mb-6">{t('docs.workflowTitle')}</h3>
          <div className="space-y-4">
            {workflowSteps.map((step, index) => (
              <Card
                key={index}
                className="p-6 hover:shadow-lg transition-all duration-300 animate-fade-in-up"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-start gap-4">
                  {/* Step Number */}
                  <div className={`flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center text-white font-bold text-lg`}>
                    {step.number}
                  </div>

                  {/* Step Icon */}
                  <div className={`flex-shrink-0 p-3 rounded-xl ${step.bgColor}`}>
                    <step.icon className="w-6 h-6" style={{ color: step.color.split(' ')[0].replace('from-', '') }} />
                  </div>

                  {/* Step Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <h4 className="text-xl font-bold text-foreground">{step.title}</h4>
                      <span className="text-xs font-mono bg-muted px-3 py-1 rounded-full whitespace-nowrap">
                        {step.status}
                      </span>
                    </div>
                    <p className="text-muted-foreground mb-3">{step.description}</p>
                    <div className="flex items-center gap-2 text-sm">
                      <ArrowLeft className="w-4 h-4 text-primary" />
                      <span className="font-semibold text-primary">{step.action}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* User Roles & Permissions */}
        <Card className="p-6 bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200">
          <h3 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Lock className="w-6 h-6 text-indigo-600" />
            {t('docs.rolesTitle')}
          </h3>
          <p className="text-muted-foreground mb-6">
            {t('docs.rolesSubtitle')}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-lg border-2 border-red-200">
              <div className="flex items-center gap-2 mb-3">
                <UserCog className="w-5 h-5 text-red-600" />
                <h4 className="font-bold text-red-600">{t('docs.adminRole')}</h4>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <span>{t('docs.fullPermissions')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <span>{t('docs.manageEmployees')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <span>{t('docs.viewActivityLogs')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <span>{t('docs.deleteClientsRequests')}</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-5 rounded-lg border-2 border-blue-200">
              <div className="flex items-center gap-2 mb-3">
                <UserPlus className="w-5 h-5 text-blue-600" />
                <h4 className="font-bold text-blue-600">{t('docs.agentRole')}</h4>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                  <span>{t('docs.manageClientsRequests')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                  <span>{t('docs.manageDocuments')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                  <span>{t('docs.viewAssignedOnly')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                  <span>{t('docs.cannotDelete')}</span>
                </li>
              </ul>
            </div>

            <div className="bg-white p-5 rounded-lg border-2 border-gray-200">
              <div className="flex items-center gap-2 mb-3">
                <Eye className="w-5 h-5 text-gray-600" />
                <h4 className="font-bold text-gray-600">{t('docs.viewerRole')}</h4>
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
                  <span>{t('docs.viewReports')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
                  <span>{t('docs.readOnlyAccess')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
                  <span>{t('docs.cannotModify')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
                  <span>{t('docs.suitableForMonitoring')}</span>
                </li>
              </ul>
            </div>
          </div>
        </Card>

        {/* Features Grid */}
        <div>
          <h3 className="text-2xl font-bold text-foreground mb-6">{t('docs.keyFeatures')}</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="p-6 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className={`p-3 rounded-xl ${feature.bgColor}`}>
                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                  </div>
                  <h4 className="text-xl font-bold text-foreground">{feature.title}</h4>
                </div>
                <ul className="space-y-2">
                  {feature.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm">{item}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>

        {/* Document Types */}
        <Card className="p-6">
          <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-primary" />
            {t('docs.supportedDocTypes')}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {documentTypes.map((doc, index) => (
              <div
                key={index}
                className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
              >
                <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                <span className="text-sm text-foreground">{doc.name}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Document Upload Guide */}
        <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200">
          <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Link className="w-5 h-5 text-purple-600" />
            {t('docs.uploadSystemTitle')}
          </h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                1
              </div>
              <div>
                <p className="font-semibold text-foreground mb-1">{t('docs.createLink')}</p>
                <p className="text-sm text-muted-foreground">
                  {t('docs.createLinkDesc')}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                2
              </div>
              <div>
                <p className="font-semibold text-foreground mb-1">{t('docs.sendLink')}</p>
                <p className="text-sm text-muted-foreground">
                  {t('docs.sendLinkDesc')}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                3
              </div>
              <div>
                <p className="font-semibold text-foreground mb-1">{t('docs.uploadDocuments')}</p>
                <p className="text-sm text-muted-foreground">
                  {t('docs.uploadDocumentsDesc')}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                4
              </div>
              <div>
                <p className="font-semibold text-foreground mb-1">{t('docs.review')}</p>
                <p className="text-sm text-muted-foreground">
                  {t('docs.reviewDesc')}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Employee Management Guide */}
        <Card className="p-6 bg-gradient-to-br from-cyan-50 to-blue-50 border-2 border-cyan-200">
          <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <UserCog className="w-5 h-5 text-cyan-600" />
            {t('docs.employeeManagementTitle')}
          </h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-cyan-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                1
              </div>
              <div>
                <p className="font-semibold text-foreground mb-1">{t('docs.addNewEmployee')}</p>
                <p className="text-sm text-muted-foreground">
                  {t('docs.addEmployeeDesc')}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-cyan-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                2
              </div>
              <div>
                <p className="font-semibold text-foreground mb-1">{t('docs.editPermissions')}</p>
                <p className="text-sm text-muted-foreground">
                  {t('docs.editPermissionsDesc')}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-cyan-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                3
              </div>
              <div>
                <p className="font-semibold text-foreground mb-1">{t('docs.deactivate')}</p>
                <p className="text-sm text-muted-foreground">
                  {t('docs.deactivateDesc')}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-cyan-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                4
              </div>
              <div>
                <p className="font-semibold text-foreground mb-1">{t('docs.searchFilter')}</p>
                <p className="text-sm text-muted-foreground">
                  {t('docs.searchFilterDesc')}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Activity Logging Guide */}
        <Card className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200">
          <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5 text-green-600" />
            {t('docs.activityLogTitle')}
          </h3>
          <p className="text-muted-foreground mb-4">
            {t('docs.activityLogDesc')}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg border border-green-200">
              <h5 className="font-semibold text-foreground mb-2">{t('docs.userActivities')}</h5>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                  {t('docs.activityUser1')}
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                  {t('docs.activityUser2')}
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                  {t('docs.activityUser3')}
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                  {t('docs.activityUser4')}
                </li>
              </ul>
            </div>

            <div className="bg-white p-4 rounded-lg border border-green-200">
              <h5 className="font-semibold text-foreground mb-2">{t('docs.clientRequestActivities')}</h5>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                  {t('docs.activityClient1')}
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                  {t('docs.activityClient2')}
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                  {t('docs.activityClient3')}
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                  {t('docs.activityClient4')}
                </li>
              </ul>
            </div>

            <div className="bg-white p-4 rounded-lg border border-green-200">
              <h5 className="font-semibold text-foreground mb-2">{t('docs.documentActivities')}</h5>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                  {t('docs.activityDoc1')}
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                  {t('docs.activityDoc2')}
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                  {t('docs.activityDoc3')}
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                  {t('docs.activityDoc4')}
                </li>
              </ul>
            </div>

            <div className="bg-white p-4 rounded-lg border border-green-200">
              <h5 className="font-semibold text-foreground mb-2">{t('docs.additionalInfo')}</h5>
              <ul className="space-y-1 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                  {t('docs.activityInfo1')}
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                  {t('docs.activityInfo2')}
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                  {t('docs.activityInfo3')}
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                  {t('docs.activityInfo4')}
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-4 p-4 bg-white rounded-lg border-2 border-green-300">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">{t('docs.activityNote')}</span> {t('docs.activityLogNote')}
            </p>
          </div>
        </Card>

        {/* Best Practices */}
        <div>
          <h3 className="text-2xl font-bold text-foreground mb-6">{t('docs.bestPracticesTitle')}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {bestPractices.map((practice, index) => (
              <Card
                key={index}
                className="p-6 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-green-100 rounded-xl">
                    <practice.icon className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground mb-2">{practice.title}</h4>
                    <p className="text-sm text-muted-foreground">{practice.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Status Guide */}
        <Card className="p-6">
          <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-primary" />
            {t('docs.statusGuideTitle')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="font-semibold text-foreground">{t('status.new')}</span>
              </div>
              <p className="text-sm text-muted-foreground">{t('docs.statusNew')}</p>
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <span className="font-semibold text-foreground">{t('status.inProgress')}</span>
              </div>
              <p className="text-sm text-muted-foreground">{t('docs.statusViewed')}</p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="font-semibold text-foreground">{t('status.approved')}</span>
              </div>
              <p className="text-sm text-muted-foreground">{t('docs.statusContacted')}</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                <span className="font-semibold text-foreground">{t('status.completed')}</span>
              </div>
              <p className="text-sm text-muted-foreground">{t('docs.statusCompleted')}</p>
            </div>
          </div>
        </Card>

        {/* Quick Tips */}
        <Card className="p-6 bg-gradient-to-br from-orange-50 to-yellow-50 border-2 border-orange-200">
          <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-orange-600" />
            {t('docs.quickTipsTitle')}
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-foreground">
                {t('docs.tip1')}
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-foreground">
                {t('docs.tip2')}
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-foreground">
                {t('docs.tip3')}
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-foreground">
                {t('docs.tip4')}
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-foreground">
                {t('docs.tip5')}
              </span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
              <span className="text-sm text-foreground">
                {t('docs.tip6')}
              </span>
            </li>
          </ul>
        </Card>

        {/* Security Best Practices */}
        <Card className="p-6 bg-gradient-to-br from-red-50 to-pink-50 border-2 border-red-200">
          <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5 text-red-600" />
            {t('docs.securityBestPracticesTitle')}
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <Lock className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground mb-1">{t('docs.strongPasswords')}</p>
                <p className="text-sm text-muted-foreground">
                  {t('docs.strongPasswordsDesc')}
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <UserCog className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground mb-1">{t('docs.leastPrivilege')}</p>
                <p className="text-sm text-muted-foreground">
                  {t('docs.leastPrivilegeDesc')}
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Activity className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground mb-1">{t('docs.reviewActivityLogs')}</p>
                <p className="text-sm text-muted-foreground">
                  {t('docs.reviewActivityLogsDesc')}
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-foreground mb-1">{t('docs.deactivateUnused')}</p>
                <p className="text-sm text-muted-foreground">
                  {t('docs.deactivateUnusedDesc')}
                </p>
              </div>
            </li>
          </ul>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Documentation;
