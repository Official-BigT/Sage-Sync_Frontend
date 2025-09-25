import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  Share2,
  Eye,
  Palette,
  User,
  Mail,
  Phone,
  Globe,
  MapPin,
} from "lucide-react";

interface BusinessCardProps {
  user: {
    name: string;
    business: string;
    monthlyGoal: number;
    currentEarnings: number;
    totalInvoices: number;
    paidInvoices: number;
  };
}

const BusinessCard = ({ user }: BusinessCardProps) => {
  const [cardData, setCardData] = useState({
    name: user.name,
    title: "",
    business: user.business,
    email: "unknownt@email.com",
    phone: "+0 (234) 567-8901",
    website: "www.unknown.com",
    address: "Lagos, Nigeria",
    bio: "Passionate about creating beautiful digital experiences that drive results.",
    theme: "modern",
    primaryColor: "#1e40af",
    accentColor: "#10b981",
  });

  const [activeTemplate, setActiveTemplate] = useState("modern");

  const templates = [
    { id: "modern", name: "Modern", preview: "Clean and professional" },
    { id: "creative", name: "Creative", preview: "Colorful and artistic" },
    { id: "minimal", name: "Minimal", preview: "Simple and elegant" },
    {
      id: "corporate",
      name: "Corporate",
      preview: "Traditional business style",
    },
  ];

  // const colorThemes = [
  //   { name: 'Ocean Blue', primary: '#1e40af', accent: '#10b981' },
  //   { name: 'Forest Green', primary: '#059669', accent: '#f59e0b' },
  //   { name: 'Royal Purple', primary: '#7c3aed', accent: '#f43f5e' },
  //   { name: 'Sunset Orange', primary: '#ea580c', accent: '#3b82f6' }
  // ];

  const BusinessCardPreview = () => {
    const getCardStyle = () => {
      switch (activeTemplate) {
        case "modern":
          return "bg-gradient-to-br from-blue-600 to-emerald-500 text-white";
        case "creative":
          return "bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white";
        case "minimal":
          return "bg-white border-2 border-gray-200 text-gray-900";
        case "corporate":
          return "bg-gray-900 text-white";
        default:
          return "bg-gradient-to-br from-blue-600 to-emerald-500 text-white";
      }
    };

    return (
      <div
        className={`w-full max-w-sm mx-auto rounded-xl p-6 shadow-xl transform transition-all hover:scale-105 ${getCardStyle()}`}
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-xl font-bold">{cardData.name}</h3>
              <p className="text-sm opacity-90">{cardData.title}</p>
              <p className="text-lg font-semibold opacity-95">
                {cardData.business}
              </p>
            </div>
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <User className="h-8 w-8" />
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span>{cardData.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span>{cardData.phone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span>{cardData.website}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{cardData.address}</span>
            </div>
          </div>

          <div className="pt-2 border-t border-white border-opacity-20">
            <p className="text-xs opacity-80">{cardData.bio}</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 sm:flex-row sm:justify-between sm:items-center sm:space-y-0">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Business Card Generator
          </h2>
          <p className="text-gray-500">
            Create professional digital business cards
          </p>
        </div>
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
          <Button
            variant="outline"
            className="flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            <Eye className="h-4 w-4" />
            Preview
          </Button>
          <Button
            variant="outline"
            className="flex items-center justify-center gap-2 w-full sm:w-auto"
          >
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
          <Button className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 w-full sm:w-auto">
            <Share2 className="h-4 w-4" />
            Share Link
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Card Editor */}
        <div className="space-y-6">
          {/* Template Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Choose Template
              </CardTitle>
              <CardDescription>
                Select a design that represents your brand
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {templates.map((template) => (
                  <div
                    key={template.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                      activeTemplate === template.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200"
                    }`}
                    onClick={() => setActiveTemplate(template.id)}
                  >
                    <div className="text-sm font-medium">{template.name}</div>
                    <div className="text-xs text-gray-500">
                      {template.preview}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Color Themes */}
          {/* <Card>
            <CardHeader>
              <CardTitle>Color Theme</CardTitle>
              <CardDescription>Choose colors that match your brand</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {colorThemes.map((theme) => (
                  <div
                    key={theme.name}
                    className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                    onClick={() => setCardData({...cardData, primaryColor: theme.primary, accentColor: theme.accent})}
                  >
                    <div className="flex gap-1">
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: theme.primary }}></div>
                      <div className="w-4 h-4 rounded-full" style={{ backgroundColor: theme.accent }}></div>
                    </div>
                    <span className="text-sm">{theme.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card> */}

          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
              <CardDescription>Your professional details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={cardData.name}
                    onChange={(e) =>
                      setCardData({ ...cardData, name: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="title">Job Title</Label>
                  <Input
                    id="title"
                    value={cardData.title}
                    onChange={(e) =>
                      setCardData({ ...cardData, title: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="business">Business Name</Label>
                <Input
                  id="business"
                  value={cardData.business}
                  onChange={(e) =>
                    setCardData({ ...cardData, business: e.target.value })
                  }
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={cardData.email}
                    onChange={(e) =>
                      setCardData({ ...cardData, email: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={cardData.phone}
                    onChange={(e) =>
                      setCardData({ ...cardData, phone: e.target.value })
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={cardData.website}
                    onChange={(e) =>
                      setCardData({ ...cardData, website: e.target.value })
                    }
                  />
                </div>
                <div>
                  <Label htmlFor="address">Location</Label>
                  <Input
                    id="address"
                    value={cardData.address}
                    onChange={(e) =>
                      setCardData({ ...cardData, address: e.target.value })
                    }
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="bio">Bio/Tagline</Label>
                <Textarea
                  id="bio"
                  placeholder="Brief description of what you do..."
                  value={cardData.bio}
                  onChange={(e) =>
                    setCardData({ ...cardData, bio: e.target.value })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live Preview */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Live Preview</CardTitle>
              <CardDescription>
                See how your business card will look
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-center">
                <BusinessCardPreview />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Template:</span>
                  <Badge variant="outline">
                    {templates.find((t) => t.id === activeTemplate)?.name}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Format:</span>
                  <Badge variant="secondary">Digital Card</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Share Options:</span>
                  <div className="flex gap-1">
                    <Badge variant="outline" className="text-xs">
                      PDF
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Link
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      QR Code
                    </Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Sharing Options</CardTitle>
              <CardDescription>How to share your business card</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start gap-2">
                <Download className="h-4 w-4" />
                Download as PDF
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <Share2 className="h-4 w-4" />
                Generate Share Link
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <Phone className="h-4 w-4" />
                Send via WhatsApp
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2">
                <Mail className="h-4 w-4" />
                Email to Client
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-emerald-50 border-emerald-200">
            <CardContent className="pt-6">
              <div className="text-center space-y-2">
                <div className="text-2xl">🚀</div>
                <p className="font-medium text-emerald-900">Pro Tip</p>
                <p className="text-sm text-emerald-700">
                  Add your business card link to your email signature and social
                  media profiles for maximum reach!
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BusinessCard;
