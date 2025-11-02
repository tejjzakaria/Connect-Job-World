#!/bin/bash

# Script to batch update hardcoded text with translation keys

# AddClient.tsx replacements
sed -i '' 's/"الاسم مطلوب"/t("errors.nameRequired")/g' src/pages/admin/AddClient.tsx
sed -i '' 's/"رقم الهاتف مطلوب"/t("errors.phoneRequired")/g' src/pages/admin/AddClient.tsx
sed -i '' 's/"رقم الهاتف غير صحيح"/t("errors.phoneInvalid")/g' src/pages/admin/AddClient.tsx
sed -i '' 's/"البريد الإلكتروني غير صحيح"/t("errors.emailInvalid")/g' src/pages/admin/AddClient.tsx
sed -i '' 's/"الخدمة مطلوبة"/t("errors.serviceRequired")/g' src/pages/admin/AddClient.tsx
sed -i '' 's/"الرسالة مطلوبة"/t("errors.messageRequired")/g' src/pages/admin/AddClient.tsx
sed -i '' 's/رجوع/{t("common.back")}/g' src/pages/admin/AddClient.tsx
sed -i '' 's/>إضافة عميل جديد</>/{t("clients.addClient")}</g' src/pages/admin/AddClient.tsx
sed -i '' 's/املأ النموذج أدناه لإضافة عميل جديد/{t("clients.addClientDescription")}/g' src/pages/admin/AddClient.tsx
sed -i '' 's/>المعلومات الأساسية</>/{t("clients.basicInfo")}</g' src/pages/admin/AddClient.tsx
sed -i '' 's/الاسم الكامل/{t("clients.fullName")}/g' src/pages/admin/AddClient.tsx
sed -i '' 's/البريد الإلكتروني/{t("clients.email")}/g' src/pages/admin/AddClient.tsx
sed -i '' 's/رقم الهاتف/{t("clients.phone")}/g' src/pages/admin/AddClient.tsx
sed -i '' 's/الخدمة المطلوبة/{t("clients.service")}/g' src/pages/admin/AddClient.tsx
sed -i '' 's/الحالة/{t("clients.status")}/g' src/pages/admin/AddClient.tsx
sed -i '' 's/التاريخ/{t("clients.date")}/g' src/pages/admin/AddClient.tsx
sed -i '' 's/>معلومات إضافية</>/{t("clients.additionalInfo")}</g' src/pages/admin/AddClient.tsx
sed -i '' 's/الرسالة \/ الملاحظات/{t("clients.message")}/g' src/pages/admin/AddClient.tsx
sed -i '' 's/إلغاء/{t("common.cancel")}/g' src/pages/admin/AddClient.tsx
sed -i '' 's/جاري الحفظ.../{t("common.saving")}/g' src/pages/admin/AddClient.tsx
sed -i '' 's/حفظ العميل/{t("clients.saveClient")}/g' src/pages/admin/AddClient.tsx
sed -i '' 's/الحقول المميزة بعلامة النجمة مطلوبة/{t("common.requiredFields")}/g' src/pages/admin/AddClient.tsx
sed -i '' 's/placeholder="اختر الخدمة"/placeholder={t("clients.selectService")}/g' src/pages/admin/AddClient.tsx

# EditClient.tsx replacements
sed -i '' 's/"الاسم مطلوب"/t("errors.nameRequired")/g' src/pages/admin/EditClient.tsx
sed -i '' 's/"رقم الهاتف مطلوب"/t("errors.phoneRequired")/g' src/pages/admin/EditClient.tsx
sed -i '' 's/"رقم الهاتف غير صحيح"/t("errors.phoneInvalid")/g' src/pages/admin/EditClient.tsx
sed -i '' 's/"البريد الإلكتروني غير صحيح"/t("errors.emailInvalid")/g' src/pages/admin/EditClient.tsx
sed -i '' 's/"الخدمة مطلوبة"/t("errors.serviceRequired")/g' src/pages/admin/EditClient.tsx
sed -i '' 's/"الرسالة مطلوبة"/t("errors.messageRequired")/g' src/pages/admin/EditClient.tsx
sed -i '' 's/رجوع/{t("common.back")}/g' src/pages/admin/EditClient.tsx
sed -i '' 's/>تعديل بيانات العميل</>/{t("clients.editClient")}</g' src/pages/admin/EditClient.tsx
sed -i '' 's/قم بتحديث المعلومات أدناه/{t("clients.editClientDescription")}/g' src/pages/admin/EditClient.tsx
sed -i '' 's/>المعلومات الأساسية</>/{t("clients.basicInfo")}</g' src/pages/admin/EditClient.tsx
sed -i '' 's/الاسم الكامل/{t("clients.fullName")}/g' src/pages/admin/EditClient.tsx
sed -i '' 's/البريد الإلكتروني/{t("clients.email")}/g' src/pages/admin/EditClient.tsx
sed -i '' 's/رقم الهاتف/{t("clients.phone")}/g' src/pages/admin/EditClient.tsx
sed -i '' 's/الخدمة المطلوبة/{t("clients.service")}/g' src/pages/admin/EditClient.tsx
sed -i '' 's/الحالة/{t("clients.status")}/g' src/pages/admin/EditClient.tsx
sed -i '' 's/>معلومات إضافية</>/{t("clients.additionalInfo")}</g' src/pages/admin/EditClient.tsx
sed -i '' 's/الرسالة \/ الملاحظات/{t("clients.message")}/g' src/pages/admin/EditClient.tsx
sed -i '' 's/إلغاء/{t("common.cancel")}/g' src/pages/admin/EditClient.tsx
sed -i '' 's/جاري الحفظ.../{t("common.saving")}/g' src/pages/admin/EditClient.tsx
sed -i '' 's/حفظ التعديلات/{t("common.saveChanges")}/g' src/pages/admin/EditClient.tsx
sed -i '' 's/الحقول المميزة بعلامة النجمة مطلوبة/{t("common.requiredFields")}/g' src/pages/admin/EditClient.tsx
sed -i '' 's/placeholder="اختر الخدمة"/placeholder={t("clients.selectService")}/g' src/pages/admin/EditClient.tsx

echo "Translation updates completed!"
