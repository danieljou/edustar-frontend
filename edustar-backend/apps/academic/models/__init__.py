from .academic_year import AcademicYear
from .room import Room
from .class_ import SchoolClass
from .subject import Subject, ClassSubject
from .exam import ExamType, Exam, ExamResult
from .timetable import Timetable

__all__ = [
    'AcademicYear', 'Room', 'SchoolClass',
    'Subject', 'ClassSubject',
    'ExamType', 'Exam', 'ExamResult',
    'Timetable',
]
