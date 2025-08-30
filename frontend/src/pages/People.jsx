import React, { useState } from "react";
import { Mail, Phone, GraduationCap, Users } from "lucide-react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { advisors, teamMembers, collaborators } from "../mock/data";

const People = () => {
  const PersonCard = ({ person, type = "advisor" }) => (
    <Card className="hover:shadow-lg transition-all duration-300 border-0 shadow-md">
      <CardContent className="p-6">
        <div className="flex items-start space-x-4">
          <img 
            src={person.image} 
            alt={person.name}
            className="w-20 h-20 rounded-full object-cover border-4 border-emerald-100"
          />
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-gray-900 mb-1">{person.name}</h3>
            <p className="text-emerald-600 font-medium mb-2">{person.title}</p>
            <p className="text-gray-600 text-sm mb-3">{person.department}</p>
            
            {type === "advisor" && (
              <div className="space-y-2">
                <p className="text-gray-700 text-sm leading-relaxed">{person.bio}</p>
                <div className="flex flex-wrap gap-1 mt-3">
                  {person.expertise?.map((skill, index) => (
                    <span key={index} className="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs font-medium rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {type === "team" && (
              <div className="space-y-2">
                <p className="text-gray-700 text-sm">
                  <strong>Research Area:</strong> {person.researchArea}
                </p>
                <p className="text-gray-600 text-sm">
                  <strong>Year:</strong> {person.year}
                </p>
              </div>
            )}
            
            {type === "collaborator" && (
              <div className="space-y-1">
                <p className="text-gray-700 text-sm">
                  <strong>Institution:</strong> {person.institution}
                </p>
                <p className="text-gray-600 text-sm">{person.department}</p>
              </div>
            )}
            
            <div className="flex items-center space-x-4 mt-4">
              <a 
                href={`mailto:${person.email}`}
                className="flex items-center text-emerald-600 hover:text-emerald-700 text-sm"
              >
                <Mail className="h-4 w-4 mr-1" />
                Email
              </a>
              {person.phone && (
                <a 
                  href={`tel:${person.phone}`}
                  className="flex items-center text-gray-600 hover:text-gray-700 text-sm"
                >
                  <Phone className="h-4 w-4 mr-1" />
                  Call
                </a>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Our Team</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Meet our dedicated researchers, advisors, and collaborators advancing sustainable energy solutions.
          </p>
        </div>

        <Tabs defaultValue="advisors" className="space-y-8">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
            <TabsTrigger value="advisors" className="flex items-center">
              <GraduationCap className="h-4 w-4 mr-2" />
              Advisors
            </TabsTrigger>
            <TabsTrigger value="team" className="flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Team
            </TabsTrigger>
            <TabsTrigger value="collaborators">Collaborators</TabsTrigger>
          </TabsList>

          {/* Advisors */}
          <TabsContent value="advisors">
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Faculty Advisors</h2>
                <p className="text-gray-600">Leading researchers and principal investigators</p>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {advisors.map((advisor) => (
                  <PersonCard key={advisor.id} person={advisor} type="advisor" />
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Team Members */}
          <TabsContent value="team">
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Research Assistants</h2>
                <p className="text-gray-600">PhD and MS students conducting cutting-edge research</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teamMembers.map((member) => (
                  <PersonCard key={member.id} person={member} type="team" />
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Collaborators */}
          <TabsContent value="collaborators">
            <div className="space-y-8">
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">External Collaborators</h2>
                <p className="text-gray-600">Partner researchers from institutions and organizations</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {collaborators.map((collaborator) => (
                  <PersonCard key={collaborator.id} person={collaborator} type="collaborator" />
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        {/* Join Us Section */}
        <section className="mt-20 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Join Our Research Team</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            We're always looking for passionate researchers to join our team. 
            Explore opportunities for PhD, MS, and postdoctoral positions.
          </p>
          <Button className="bg-emerald-600 hover:bg-emerald-700">
            View Open Positions
          </Button>
        </section>
      </div>
    </div>
  );
};

export default People;