"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DiscoveryFormData } from "@/hooks/useDiscoveryForm";

interface Section1BasicsProps {
  formData: DiscoveryFormData;
  updateField: (field: keyof DiscoveryFormData, value: any) => void;
}

export default function Section1Basics({
  formData,
  updateField,
}: Section1BasicsProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="companyName">Company Name *</Label>
          <Input
            id="companyName"
            value={formData.companyName}
            onChange={(e) => updateField("companyName", e.target.value)}
            placeholder="Enter your company name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactName">Your Name *</Label>
          <Input
            id="contactName"
            value={formData.contactName}
            onChange={(e) => updateField("contactName", e.target.value)}
            placeholder="Enter your full name"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactEmail">Your Email *</Label>
          <Input
            id="contactEmail"
            type="email"
            value={formData.contactEmail}
            onChange={(e) => updateField("contactEmail", e.target.value)}
            placeholder="Enter your email address"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactRole">Your Role/Title *</Label>
          <Input
            id="contactRole"
            value={formData.contactRole}
            onChange={(e) => updateField("contactRole", e.target.value)}
            placeholder="e.g., VP of Operations, Customer Success Manager"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="companySize">Company Size</Label>
          <select
            id="companySize"
            value={formData.companySize}
            onChange={(e) => updateField("companySize", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select company size</option>
            <option value="1-10">1-10 employees</option>
            <option value="11-50">11-50 employees</option>
            <option value="51-200">51-200 employees</option>
            <option value="201-1000">201-1,000 employees</option>
            <option value="1000+">1,000+ employees</option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="industry">Industry</Label>
          <select
            id="industry"
            value={formData.industry}
            onChange={(e) => updateField("industry", e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select your industry</option>
            <option value="Technology">Technology</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Financial Services">Financial Services</option>
            <option value="Retail/E-commerce">Retail/E-commerce</option>
            <option value="Manufacturing">Manufacturing</option>
            <option value="Professional Services">Professional Services</option>
            <option value="Education">Education</option>
            <option value="Real Estate">Real Estate</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>
    </div>
  );
}
