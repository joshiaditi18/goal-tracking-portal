const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('./models/User');
const Department = require('./models/Department');
const Cycle = require('./models/Cycle');
const Goal = require('./models/Goal');
const SharedGoal = require('./models/SharedGoal');
const GoalSheet = require('./models/GoalSheet');
const QuarterCheckin = require('./models/QuarterCheckin');
const Comment = require('./models/Comment');
const AuditLog = require('./models/AuditLog');

dotenv.config({ path: './.env' });

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB for seeding');

    await Promise.all([
      User.deleteMany({}),
      Department.deleteMany({}),
      Cycle.deleteMany({}),
      Goal.deleteMany({}),
      SharedGoal.deleteMany({}),
      GoalSheet.deleteMany({}),
      QuarterCheckin.deleteMany({}),
      Comment.deleteMany({}),
      AuditLog.deleteMany({}),
    ]);

    const engineering = await Department.create({
      name: 'Engineering',
      code: 'ENG',
      description: 'Product delivery, engineering execution and technical enablement.',
      metadata: { location: 'HQ', function: 'Product' },
    });

    const operations = await Department.create({
      name: 'Operations',
      code: 'OPS',
      description: 'Operations, process improvement and internal adoption.',
      metadata: { location: 'HQ', function: 'Operations' },
    });

    const passwords = {
      admin: await bcrypt.hash('Admin@1234', 12),
      manager1: await bcrypt.hash('Manager1@1234', 12),
      manager2: await bcrypt.hash('Manager2@1234', 12),
      employee1: await bcrypt.hash('Employee1@1234', 12),
      employee2: await bcrypt.hash('Employee2@1234', 12),
      employee3: await bcrypt.hash('Employee3@1234', 12),
      employee4: await bcrypt.hash('Employee4@1234', 12),
      employee5: await bcrypt.hash('Employee5@1234', 12),
    };

    const admin = await User.create({
      name: 'System Admin',
      email: 'admin@company.com',
      password: passwords.admin,
      role: 'admin',
      department: engineering._id,
      phone: '555-0100',
      meta: { jobTitle: 'HR Admin', location: 'Head Office' },
    });

    const managerOne = await User.create({
      name: 'L1 Manager',
      email: 'manager1@company.com',
      password: passwords.manager1,
      role: 'manager',
      department: engineering._id,
      manager: admin._id,
      phone: '555-0101',
      meta: { jobTitle: 'Engineering Manager', location: 'Head Office' },
    });

    const managerTwo = await User.create({
      name: 'L2 Manager',
      email: 'manager2@company.com',
      password: passwords.manager2,
      role: 'manager',
      department: operations._id,
      manager: admin._id,
      phone: '555-0102',
      meta: { jobTitle: 'Operations Manager', location: 'Head Office' },
    });

    const employees = await User.create([
      {
        name: 'Alice Johnson',
        email: 'alice@company.com',
        password: passwords.employee1,
        role: 'employee',
        department: engineering._id,
        manager: managerOne._id,
        phone: '555-0103',
        meta: { jobTitle: 'Frontend Engineer', location: 'HQ' },
      },
      {
        name: 'Brian Lee',
        email: 'brian@company.com',
        password: passwords.employee2,
        role: 'employee',
        department: engineering._id,
        manager: managerOne._id,
        phone: '555-0104',
        meta: { jobTitle: 'Backend Engineer', location: 'HQ' },
      },
      {
        name: 'Carla Smith',
        email: 'carla@company.com',
        password: passwords.employee3,
        role: 'employee',
        department: operations._id,
        manager: managerTwo._id,
        phone: '555-0105',
        meta: { jobTitle: 'Operations Analyst', location: 'HQ' },
      },
      {
        name: 'David Patel',
        email: 'david@company.com',
        password: passwords.employee4,
        role: 'employee',
        department: operations._id,
        manager: managerTwo._id,
        phone: '555-0106',
        meta: { jobTitle: 'Process Coordinator', location: 'HQ' },
      },
      {
        name: 'Emma Turner',
        email: 'emma@company.com',
        password: passwords.employee5,
        role: 'employee',
        department: engineering._id,
        manager: managerOne._id,
        phone: '555-0107',
        meta: { jobTitle: 'QA Engineer', location: 'HQ' },
      },
    ]);

    engineering.members = [managerOne._id, employees[0]._id, employees[1]._id, employees[4]._id];
    operations.members = [managerTwo._id, employees[2]._id, employees[3]._id];
    engineering.manager = managerOne._id;
    operations.manager = managerTwo._id;
    await engineering.save();
    await operations.save();

    const q1Cycle = await Cycle.create({
      name: 'Q1 2026 Review Cycle',
      quarter: 'Q1',
      year: 2026,
      goalSettingWindowStart: new Date('2026-01-01'),
      goalSettingWindowEnd: new Date('2026-01-31'),
      q1WindowStart: new Date('2026-02-01'),
      q1WindowEnd: new Date('2026-03-31'),
      q2WindowStart: new Date('2026-04-01'),
      q2WindowEnd: new Date('2026-06-30'),
      q3WindowStart: new Date('2026-07-01'),
      q3WindowEnd: new Date('2026-09-30'),
      q4WindowStart: new Date('2026-10-01'),
      q4WindowEnd: new Date('2026-12-31'),
      trackingWindowStart: new Date('2026-02-01'),
      trackingWindowEnd: new Date('2026-12-31'),
      active: true,
      metadata: { year: 2026, phase: 'Goal Setting' },
    });

    const q2Cycle = await Cycle.create({
      name: 'Q2 2026 Planning Cycle',
      quarter: 'Q2',
      year: 2026,
      goalSettingWindowStart: new Date('2026-04-01'),
      goalSettingWindowEnd: new Date('2026-04-30'),
      q1WindowStart: new Date('2026-05-01'),
      q1WindowEnd: new Date('2026-06-30'),
      q2WindowStart: new Date('2026-07-01'),
      q2WindowEnd: new Date('2026-09-30'),
      q3WindowStart: new Date('2026-10-01'),
      q3WindowEnd: new Date('2026-12-31'),
      q4WindowStart: new Date('2027-01-01'),
      q4WindowEnd: new Date('2027-03-31'),
      trackingWindowStart: new Date('2026-05-01'),
      trackingWindowEnd: new Date('2027-03-31'),
      active: false,
      metadata: { year: 2026, phase: 'Planning' },
    });

    const sharedGoals = await SharedGoal.create([
      {
        title: 'Improve customer onboarding satisfaction',
        description: 'Reduce onboarding friction and improve customer experience metrics.',
        thrustArea: 'Customer Success',
        uomType: 'Percentage',
        target: 15,
        targetDate: new Date('2026-03-31'),
        primaryOwner: managerOne._id,
        linkedEmployees: [employees[0]._id, employees[1]._id],
        weightageByEmployee: [
          { employee: employees[0]._id, weightage: 60 },
          { employee: employees[1]._id, weightage: 40 },
        ],
        quarter: 'Q1',
        cycle: q1Cycle._id,
        status: 'active',
      },
      {
        title: 'Streamline operations workflow',
        description: 'Remove manual handoffs and reduce process cycle time.',
        thrustArea: 'Operational Excellence',
        uomType: 'Numeric',
        target: 3,
        targetDate: new Date('2026-06-30'),
        primaryOwner: managerTwo._id,
        linkedEmployees: [employees[2]._id, employees[3]._id],
        weightageByEmployee: [
          { employee: employees[2]._id, weightage: 50 },
          { employee: employees[3]._id, weightage: 50 },
        ],
        quarter: 'Q2',
        cycle: q1Cycle._id,
        status: 'draft',
      },
    ]);

    const employeeGoals = await Goal.create([
      {
        owner: employees[0]._id,
        sheet: null,
        sharedGoal: sharedGoals[0]._id,
        thrustArea: 'Customer Success',
        title: 'Complete onboarding workflow review',
        description: 'Finalize the onboarding checklist and automate follow ups.',
        uomType: 'Numeric',
        target: 4,
        targetDate: new Date('2026-03-31'),
        weightage: 20,
        status: 'approved',
        quarter: 'Q1',
        cycle: q1Cycle._id,
        isShared: true,
        progressScore: 40,
      },
      {
        owner: employees[1]._id,
        sheet: null,
        sharedGoal: sharedGoals[0]._id,
        thrustArea: 'Customer Success',
        title: 'Deploy onboarding automation bots',
        description: 'Build automated actions for onboarding edge cases.',
        uomType: 'Percentage',
        target: 85,
        targetDate: new Date('2026-03-31'),
        weightage: 20,
        status: 'submitted',
        quarter: 'Q1',
        cycle: q1Cycle._id,
        isShared: true,
        progressScore: 50,
      },
      {
        owner: employees[2]._id,
        sheet: null,
        sharedGoal: sharedGoals[1]._id,
        thrustArea: 'Operational Excellence',
        title: 'Map current process flows',
        description: 'Document handoffs for the customer escalation process.',
        uomType: 'Numeric',
        target: 3,
        targetDate: new Date('2026-06-30'),
        weightage: 25,
        status: 'draft',
        quarter: 'Q2',
        cycle: q1Cycle._id,
        progressScore: 20,
      },
      {
        owner: employees[4]._id,
        sheet: null,
        thrustArea: 'Quality Assurance',
        title: 'Launch regression test automation',
        description: 'Create reusable regression suites for core product flows.',
        uomType: 'Numeric',
        target: 8,
        targetDate: new Date('2026-03-31'),
        weightage: 30,
        status: 'approved',
        quarter: 'Q1',
        cycle: q1Cycle._id,
        progressScore: 60,
      },
    ]);

    const goalSheets = await GoalSheet.create([
      {
        employee: employees[0]._id,
        manager: managerOne._id,
        goals: [employeeGoals[0]._id],
        cycle: q1Cycle._id,
        quarter: 'Q1',
        status: 'approved',
        submittedAt: new Date('2026-01-28'),
        approvedAt: new Date('2026-01-31'),
        totalWeightage: 20,
        metadata: { submittedBy: employees[0]._id, draftSavedAt: new Date('2026-01-24') },
      },
      {
        employee: employees[1]._id,
        manager: managerOne._id,
        goals: [employeeGoals[1]._id],
        cycle: q1Cycle._id,
        quarter: 'Q1',
        status: 'submitted',
        submittedAt: new Date('2026-01-29'),
        totalWeightage: 20,
        metadata: { submittedBy: employees[1]._id, draftSavedAt: new Date('2026-01-26') },
      },
      {
        employee: employees[2]._id,
        manager: managerTwo._id,
        goals: [employeeGoals[2]._id],
        cycle: q1Cycle._id,
        quarter: 'Q2',
        status: 'draft',
        totalWeightage: 25,
        metadata: { submittedBy: employees[2]._id, draftSavedAt: new Date('2026-03-15') },
      },
    ]);

    await QuarterCheckin.create([
      {
        goal: employeeGoals[0]._id,
        employee: employees[0]._id,
        quarter: 'Q1',
        cycle: q1Cycle._id,
        actualAchievement: 2,
        achievementStatus: 'On Track',
        checkinDate: new Date('2026-02-28'),
        managerComments: 'Good progress, continue updating sprint goals.',
        updatedBy: managerOne._id,
        score: 40,
      },
      {
        goal: employeeGoals[1]._id,
        employee: employees[1]._id,
        quarter: 'Q1',
        cycle: q1Cycle._id,
        actualAchievement: 1,
        achievementStatus: 'Not Started',
        checkinDate: new Date('2026-02-26'),
        managerComments: 'Need stronger cadence on feature delivery.',
        updatedBy: managerOne._id,
        score: 20,
      },
    ]);

    console.log('Seed data created successfully.');
    console.log('Use these sample credentials:');
    console.log('Admin:', 'admin@company.com / Admin@1234');
    console.log('Manager 1:', 'manager1@company.com / Manager1@1234');
    console.log('Manager 2:', 'manager2@company.com / Manager2@1234');
    console.log('Employee 1:', 'alice@company.com / Employee1@1234');
    console.log('Employee 2:', 'brian@company.com / Employee2@1234');
    console.log('Employee 3:', 'carla@company.com / Employee3@1234');
    console.log('Employee 4:', 'david@company.com / Employee4@1234');
    console.log('Employee 5:', 'emma@company.com / Employee5@1234');

    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seed();